import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import crypto from "crypto";

const VOICE_ID = "Qhbt6q88OM5yjxeWKS0e"; // Robin
const MODEL_ID = "eleven_multilingual_v2";
const OUTPUT_FORMAT = "mp3_44100_128";
const CACHE_DIR = join(process.cwd(), ".tts-cache");

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const { text } = await req.json();

  if (!text || typeof text !== "string" || text.length > 5000) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  // Deterministic cache key
  const hash = crypto
    .createHash("sha256")
    .update(`elevenlabs:${VOICE_ID}:${text}`)
    .digest("hex");
  const cacheFile = join(CACHE_DIR, `${hash}.mp3`);

  // Return cached audio if it exists
  if (existsSync(cacheFile)) {
    const cached = readFileSync(cacheFile);
    return new NextResponse(cached, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  }

  // Call ElevenLabs TTS REST API
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, model_id: MODEL_ID }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("ElevenLabs TTS error:", res.status, errText);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: res.status === 429 ? 429 : 502 }
    );
  }

  const audioBuffer = Buffer.from(await res.arrayBuffer());

  // Save to disk cache
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(cacheFile, audioBuffer);
  } catch {
    // Non-fatal: cache write failure
  }

  return new NextResponse(audioBuffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
