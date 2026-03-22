"use client";

import { useRef, useCallback, useState } from "react";
import { pcmToWav } from "@/lib/pcm-to-wav";

/** In-memory cache: text → blob URL (session-lifetime) */
const urlCache = new Map<string, string>();

interface UseTTSReturn {
  /** Speak text, returns when finished */
  speak: (text: string) => Promise<void>;
  /** Stop current playback */
  stop: () => void;
  /** Whether audio is currently loading from API */
  loading: boolean;
}

export function useTTS(): UseTTSReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const speak = useCallback(
    async (text: string): Promise<void> => {
      stop();

      const cacheKey = text;
      let blobUrl = urlCache.get(cacheKey);

      if (!blobUrl) {
        setLoading(true);
        try {
          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, voiceName: "Kore" }),
          });

          if (!res.ok) throw new Error(`TTS API ${res.status}`);

          const { audioData, sampleRate } = await res.json();
          const blob = pcmToWav(audioData, sampleRate);
          blobUrl = URL.createObjectURL(blob);
          urlCache.set(cacheKey, blobUrl);
        } catch (err) {
          console.warn("Gemini TTS failed, falling back to browser:", err);
          setLoading(false);
          // Fallback to browser SpeechSynthesis
          return browserFallback(text);
        }
        setLoading(false);
      }

      return new Promise<void>((resolve) => {
        const audio = new Audio(blobUrl!);
        audioRef.current = audio;
        audio.onended = () => {
          audioRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          audioRef.current = null;
          resolve();
        };
        audio.play().catch(() => resolve());
      });
    },
    [stop]
  );

  return { speak, stop, loading };
}

function browserFallback(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "de-DE";
    utt.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const de = voices.find((v) => v.lang.startsWith("de"));
    if (de) utt.voice = de;
    utt.onend = () => resolve();
    utt.onerror = () => resolve();
    window.speechSynthesis.speak(utt);
  });
}
