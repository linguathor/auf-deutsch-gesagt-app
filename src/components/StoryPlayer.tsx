"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Play, Pause, RotateCcw, Volume2, Loader2, X } from "lucide-react";
import { CourseModule, VocabItem } from "@/types";
import { useTTS } from "@/lib/use-tts";

interface StoryPlayerProps {
  module: CourseModule;
  onComplete?: () => void;
}

/** Build a lookup map: lowercase word → VocabItem */
function buildWordLookup(module: CourseModule): Map<string, VocabItem> {
  const map = new Map<string, VocabItem>();
  for (const v of module.coreVerbs) {
    // Add the main german entry and also each word in it
    const words = v.german.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 2) map.set(w.replace(/[^a-zäöüß]/g, ""), v);
    }
    map.set(v.german.toLowerCase(), v);
  }
  for (const v of module.idioms) {
    const words = v.german.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 2) map.set(w.replace(/[^a-zäöüß]/g, ""), v);
    }
    map.set(v.german.toLowerCase(), v);
  }
  return map;
}

/** Strip bold markers for matching */
function stripBold(text: string) {
  return text.replace(/\*\*/g, "");
}

export default function StoryPlayer({ module, onComplete }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(-1);
  const [hasFinished, setHasFinished] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    vocab: VocabItem;
    rect: { top: number; left: number };
  } | null>(null);

  const { speak, stop, loading } = useTTS();
  const cancelledRef = useRef(false);

  const sentences = module.story.sentences;
  const wordLookup = useMemo(() => buildWordLookup(module), [module]);

  // Sequential playback: speak each sentence one-by-one
  const playAll = useCallback(async () => {
    cancelledRef.current = false;
    setIsPlaying(true);
    setHasFinished(false);

    for (let i = 0; i < sentences.length; i++) {
      if (cancelledRef.current) break;
      setCurrentSentence(i);
      await speak(sentences[i].text);
    }

    if (!cancelledRef.current) {
      setHasFinished(true);
      onComplete?.();
    }
    setCurrentSentence(-1);
    setIsPlaying(false);
  }, [sentences, speak, onComplete]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      cancelledRef.current = true;
      stop();
      setIsPlaying(false);
      setCurrentSentence(-1);
    } else {
      playAll();
    }
  }, [isPlaying, stop, playAll]);

  const restart = useCallback(() => {
    cancelledRef.current = true;
    stop();
    setIsPlaying(false);
    setCurrentSentence(-1);
    setHasFinished(false);
  }, [stop]);

  const speakSentence = useCallback(
    (idx: number) => {
      if (isPlaying) return; // don't interrupt sequential playback
      const s = sentences[idx];
      if (!s) return;
      setCurrentSentence(idx);
      speak(s.text).then(() => {
        setCurrentSentence(-1);
      });
    },
    [sentences, speak, isPlaying]
  );

  const handleWordClick = useCallback(
    (e: React.MouseEvent, word: string) => {
      e.stopPropagation();
      const clean = word.toLowerCase().replace(/[^a-zäöüß]/g, "");
      const vocab = wordLookup.get(clean);
      if (!vocab) {
        // Just speak the word even if no vocab entry
        speak(word);
        return;
      }
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setSelectedWord({
        word,
        vocab,
        rect: { top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX },
      });
      speak(word);
    },
    [wordLookup, speak]
  );

  const progressPct =
    sentences.length > 0 && currentSentence >= 0
      ? ((currentSentence + 1) / sentences.length) * 100
      : 0;

  // Precompute which sentences belong to which paragraph (sequential assignment)
  const sentencesByPara = useMemo(() => {
    const result: number[][] = module.story.paragraphs.map(() => []);
    let sIdx = 0;
    for (
      let pIdx = 0;
      pIdx < module.story.paragraphs.length && sIdx < sentences.length;
      pIdx++
    ) {
      const para = module.story.paragraphs[pIdx];
      while (sIdx < sentences.length) {
        const sTxt = stripBold(sentences[sIdx].text).replace(/["""]/g, "");
        if (para.replace(/["""]/g, "").includes(sTxt)) {
          result[pIdx].push(sIdx);
          sIdx++;
        } else {
          break;
        }
      }
    }
    while (sIdx < sentences.length) {
      result[result.length - 1].push(sIdx);
      sIdx++;
    }
    return result;
  }, [sentences, module.story.paragraphs]);

  /** Render a sentence as individually clickable words */
  const renderWords = (text: string, sentenceIdx: number) => {
    // Strip bold markers then split into words preserving whitespace
    const plain = stripBold(text);
    const words = plain.split(/(\s+)/);
    return words.map((w, wi) => {
      if (/^\s+$/.test(w)) return w; // preserve whitespace
      const clean = w.toLowerCase().replace(/[^a-zäöüß]/g, "");
      const hasVocab = clean.length > 2 && wordLookup.has(clean);
      return (
        <span
          key={`${sentenceIdx}-${wi}`}
          onClick={(e) => handleWordClick(e, w)}
          className={`cursor-pointer transition-colors ${
            hasVocab
              ? "underline decoration-gold-500/40 decoration-dotted underline-offset-2 hover:text-gold-400"
              : "hover:text-gold-400"
          }`}
        >
          {w}
        </span>
      );
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      {/* Story header image */}
      {module.story.headerImage && (
        <div className="mb-4 rounded-lg overflow-hidden h-48 bg-navy-700">
          <img
            src={module.story.headerImage}
            alt={module.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!module.story.headerImage && (
        <div className="mb-4 rounded-lg overflow-hidden h-32 bg-gradient-to-r from-navy-700 via-navy-600 to-navy-700 flex items-center justify-center">
          <span className="text-4xl">📖</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Geschichte</h3>
        <div className="flex items-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />
          )}
          {hasFinished && (
            <span className="text-xs text-emerald-400 font-medium">
              ✓ Gelesen
            </span>
          )}
        </div>
      </div>

      {/* Audio controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-900 flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
        <button
          onClick={restart}
          className="text-muted hover:text-foreground transition-colors"
          title="Neustart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-500 rounded-full transition-all duration-150"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <Volume2 className="w-4 h-4 text-muted" />
      </div>

      {/* Story text with sentence highlighting + clickable words */}
      <div className="leading-relaxed text-foreground/90 space-y-4">
        {module.story.paragraphs.map((_para, pIdx) => (
          <p key={pIdx} className="text-base">
            {(sentencesByPara[pIdx] || []).map((sIdx) => {
              const s = sentences[sIdx];
              const isActive = sIdx === currentSentence;
              return (
                <span
                  key={sIdx}
                  onClick={() => speakSentence(sIdx)}
                  className={`inline transition-all duration-200 ${
                    isActive
                      ? "bg-gold-500/25 text-gold-300 rounded px-0.5 py-0.5"
                      : ""
                  }`}
                >
                  {renderWords(s.displayText ?? s.text, sIdx)}{" "}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      {/* Word tooltip popup */}
      {selectedWord && (
        <div
          className="fixed z-50 bg-navy-800 border border-gold-500/30 rounded-lg shadow-xl p-4 max-w-xs"
          style={{ top: selectedWord.rect.top, left: selectedWord.rect.left }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gold-400">
              {selectedWord.vocab.german}
            </span>
            <button
              onClick={() => setSelectedWord(null)}
              className="text-muted hover:text-foreground transition-colors ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {selectedWord.vocab.definition && (
            <p className="text-sm text-foreground/80 mb-1 flex items-start gap-2">
              <button
                onClick={() => speak(selectedWord.vocab.definition!)}
                className="text-gold-500 hover:text-gold-400 shrink-0 mt-0.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <span>{selectedWord.vocab.definition}</span>
            </p>
          )}
          {selectedWord.vocab.example && (
            <p className="text-sm text-muted mt-1 flex items-start gap-2">
              <button
                onClick={() => speak(selectedWord.vocab.example!)}
                className="text-gold-500 hover:text-gold-400 shrink-0 mt-0.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <span className="italic">{selectedWord.vocab.example}</span>
            </p>
          )}
        </div>
      )}

      {/* Click-away overlay for tooltip */}
      {selectedWord && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSelectedWord(null)}
        />
      )}
    </div>
  );
}
