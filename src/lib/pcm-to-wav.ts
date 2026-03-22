/**
 * Convert base64-encoded PCM16 audio (from Gemini TTS) into a playable WAV Blob.
 */
export function pcmToWav(base64PCM: string, sampleRate = 24000): Blob {
  const binary = atob(base64PCM);
  const len = binary.length;
  const buffer = new ArrayBuffer(len);
  const view = new DataView(buffer);
  for (let i = 0; i < len; i++) {
    view.setUint8(i, binary.charCodeAt(i));
  }
  const pcmData = new Int16Array(buffer);

  const wavBuffer = new ArrayBuffer(44 + pcmData.length * 2);
  const w = new DataView(wavBuffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) w.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  w.setUint32(4, 36 + pcmData.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  w.setUint32(16, 16, true);
  w.setUint16(20, 1, true); // PCM
  w.setUint16(22, 1, true); // mono
  w.setUint32(24, sampleRate, true);
  w.setUint32(28, sampleRate * 2, true);
  w.setUint16(32, 2, true);
  w.setUint16(34, 16, true);
  writeStr(36, "data");
  w.setUint32(40, pcmData.length * 2, true);

  let offset = 44;
  for (let i = 0; i < pcmData.length; i++, offset += 2) {
    w.setInt16(offset, pcmData[i], true);
  }

  return new Blob([w], { type: "audio/wav" });
}
