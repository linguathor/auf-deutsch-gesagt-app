"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { CourseModule } from "@/types";
import { speakGerman, stopSpeaking } from "@/lib/tts";

interface StoryPlayerProps {
  module: CourseModule;
  onComplete?: () => void;
}

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function StoryPlayer({ module, onComplete }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const sentences = module.story.sentences;

  const updateCurrent = useCallback(() => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setCurrentTime(t);
    const idx = sentences.findIndex((s) => t >= s.start && t < s.end);
    setCurrentSentence(idx);
  }, [sentences]);

  const togglePlay = useCallback(() => {
    if (!module.story.audioFile) {
      // Demo mode: simulate playback via timers
      if (isPlaying) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        let time = currentTime;
        intervalRef.current = setInterval(() => {
          time += 0.1;
          setCurrentTime(time);
          const idx = sentences.findIndex((s) => time >= s.start && time < s.end);
          setCurrentSentence(idx);
          if (time >= sentences[sentences.length - 1].end) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            setHasFinished(true);
            onComplete?.();
          }
        }, 100);
      }
      return;
    }
    // Real audio mode
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, currentTime, sentences, module.story.audioFile, onComplete]);

  const restart = useCallback(() => {
    setCurrentTime(0);
    setCurrentSentence(-1);
    setIsPlaying(false);
    setHasFinished(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const jumpToSentence = useCallback(
    (idx: number) => {
      const s = sentences[idx];
      if (!s) return;
      setCurrentTime(s.start);
      setCurrentSentence(idx);
      if (audioRef.current) {
        audioRef.current.currentTime = s.start;
      }
      // Also speak the sentence via TTS
      stopSpeaking();
      speakGerman(s.text);
    },
    [sentences]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const totalDuration = sentences.length
    ? sentences[sentences.length - 1].end
    : 0;
  const progressPct = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

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
        {hasFinished && (
          <span className="text-xs text-emerald-400 font-medium">
            ✓ Gelesen
          </span>
        )}
      </div>

      {/* SoundCloud embed */}
      {module.story.soundcloudUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="166"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(module.story.soundcloudUrl)}&color=%23c9a84c&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
          />
        </div>
      )}

      {/* Audio controls (TTS / local file) */}
      <div className={`flex items-center gap-4 ${module.story.soundcloudUrl ? "hidden" : "mb-6"}`}>
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

      {/* Story text with sentence highlighting */}
      <div className="leading-relaxed text-foreground/90 space-y-4 mt-4">
        {module.story.paragraphs.map((para, pIdx) => (
          <p key={pIdx} className="text-base">
            {sentences
              .filter((s) => para.includes(s.text))
              .map((s) => {
                const sIdx = sentences.indexOf(s);
                const isActive = sIdx === currentSentence;
                return (
                  <span
                    key={sIdx}
                    onClick={() => jumpToSentence(sIdx)}
                    className={`story-word inline cursor-pointer transition-all duration-150 ${
                      isActive
                        ? "bg-gold-500/30 text-gold-300 rounded px-0.5"
                        : "hover:text-gold-400"
                    }`}
                  >
                    {renderBold(s.displayText ?? s.text)}{" "}
                  </span>
                );
              })}
          </p>
        ))}
      </div>

      {/* Local audio file (for future modules) */}
      {module.story.audioFile && (
        <audio
          ref={audioRef}
          src={module.story.audioFile}
          onTimeUpdate={updateCurrent}
          onEnded={() => {
            setIsPlaying(false);
            setHasFinished(true);
            onComplete?.();
          }}
        />
      )}
    </div>
  );
}
