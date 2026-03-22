import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import crypto from "crypto";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CACHE_DIR = join(process.cwd(), ".tts-cache");

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const { text, voiceName } = await req.json();

  if (!text || typeof text !== "string" || text.length > 2000) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  // Deterministic cache key from text + voice
  const voice = voiceName || "Kore";
  const hash = crypto.createHash("sha256").update(`${voice}:${text}`).digest("hex");
  const cacheFile = join(CACHE_DIR, `${hash}.json`);

  // Return cached audio if it exists
  if (existsSync(cacheFile)) {
    const cached = JSON.parse(readFileSync(cacheFile, "utf-8"));
    return NextResponse.json(cached);
  }

  // Call Gemini TTS API
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini TTS error:", res.status, errText);
    return NextResponse.json(
      { error: "TTS generation failed", status: res.status },
      { status: res.status === 429 ? 429 : 502 }
    );
  }

  const data = await res.json();
  const audioData =
    data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!audioData) {
    return NextResponse.json({ error: "No audio in response" }, { status: 502 });
  }

  const result = { audioData, sampleRate: 24000 };

  // Save to disk cache
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(cacheFile, JSON.stringify(result));
  } catch {
    // Non-fatal: cache write failure
  }

  return NextResponse.json(result);
}
