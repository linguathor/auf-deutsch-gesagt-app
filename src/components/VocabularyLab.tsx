"use client";

import { useState } from "react";
import { Volume2, ChevronDown, ChevronUp } from "lucide-react";
import { VocabItem } from "@/types";
import { useTTS } from "@/lib/use-tts";

interface VocabularyLabProps {
  coreVerbs: VocabItem[];
  idioms: VocabItem[];
  onComplete?: () => void;
}

export default function VocabularyLab({ coreVerbs, idioms, onComplete }: VocabularyLabProps) {
  const [expandedVerb, setExpandedVerb] = useState<number | null>(null);
  const [expandedIdiom, setExpandedIdiom] = useState<number | null>(null);
  const [viewedCount, setViewedCount] = useState(0);
  const { speak } = useTTS();

  const totalItems = coreVerbs.length + idioms.length;

  const handleToggle = (type: "verb" | "idiom", idx: number) => {
    if (type === "verb") {
      if (expandedVerb !== idx) setViewedCount((p) => Math.min(p + 1, totalItems));
      setExpandedVerb(expandedVerb === idx ? null : idx);
    } else {
      if (expandedIdiom !== idx) setViewedCount((p) => Math.min(p + 1, totalItems));
      setExpandedIdiom(expandedIdiom === idx ? null : idx);
    }
    if (viewedCount + 1 >= totalItems) {
      onComplete?.();
    }
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speak(text);
  };

  return (
    <div className="space-y-6">
      {/* Core Verbs */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Verben & Ausdrücke
        </h3>
        <div className="space-y-2">
          {coreVerbs.map((verb, idx) => (
            <div
              key={idx}
              className="bg-navy-800/50 rounded-lg border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => handleToggle("verb", idx)}
                className="w-full flex items-center justify-between p-3 hover:bg-navy-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleSpeak(e, verb.german)}
                    className="text-gold-500 hover:text-gold-400 transition-colors shrink-0"
                    title="Anhören"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-foreground text-left">{verb.german}</span>
                </div>
                <div className="flex items-center gap-2">
                  {expandedVerb === idx ? (
                    <ChevronUp className="w-4 h-4 text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted" />
                  )}
                </div>
              </button>
              {expandedVerb === idx && (
                <div className="px-3 pb-3 border-t border-border/30">
                  {verb.definition && (
                    <p className="text-sm text-foreground/80 mt-2 flex items-start gap-2">
                      <button
                        onClick={() => speak(verb.definition!)}
                        className="text-gold-500 hover:text-gold-400 transition-colors shrink-0 mt-0.5"
                        title="Definition anhören"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span>
                        <span className="text-gold-400 font-medium">Definition:</span>{" "}
                        {verb.definition}
                      </span>
                    </p>
                  )}
                  {verb.example && (
                    <p className="text-sm text-muted mt-2 flex items-start gap-2">
                      <button
                        onClick={() => speak(verb.example!)}
                        className="text-gold-500 hover:text-gold-400 transition-colors shrink-0 mt-0.5"
                        title="Beispiel anhören"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span>
                        <span className="text-gold-400">Beispiel:</span>{" "}
                        <span className="italic">{verb.example}</span>
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Idioms */}
      {idioms.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Redewendungen & Idiome
          </h3>
          <div className="space-y-2">
            {idioms.map((idiom, idx) => (
              <div
                key={idx}
                className="bg-navy-800/50 rounded-lg border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() => handleToggle("idiom", idx)}
                  className="w-full flex items-center justify-between p-3 hover:bg-navy-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleSpeak(e, idiom.german)}
                      className="text-gold-500 hover:text-gold-400 transition-colors shrink-0"
                      title="Anhören"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className="font-medium text-foreground text-left">{idiom.german}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedIdiom === idx ? (
                      <ChevronUp className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </div>
                </button>
                {expandedIdiom === idx && (
                  <div className="px-3 pb-3 border-t border-border/30">
                    {idiom.definition && (
                      <p className="text-sm text-foreground/80 mt-2 flex items-start gap-2">
                        <button
                          onClick={() => speak(idiom.definition!)}
                          className="text-gold-500 hover:text-gold-400 transition-colors shrink-0 mt-0.5"
                          title="Definition anhören"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span>
                          <span className="text-gold-400 font-medium">Definition:</span>{" "}
                          {idiom.definition}
                        </span>
                      </p>
                    )}
                    {idiom.example && (
                      <p className="text-sm text-muted mt-2 flex items-start gap-2">
                        <button
                          onClick={() => speak(idiom.example!)}
                          className="text-gold-500 hover:text-gold-400 transition-colors shrink-0 mt-0.5"
                          title="Beispiel anhören"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span>
                          <span className="text-gold-400">Beispiel:</span>{" "}
                          <span className="italic">{idiom.example}</span>
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
