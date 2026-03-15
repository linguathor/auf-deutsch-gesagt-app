/**
 * Generate themed SVG header images for each module story.
 * Run: node scripts/generate-images.mjs
 */
import { writeFileSync } from "fs";

const modules = [
  { num: 1, title: "Der Umzug", emoji: "📦", verb: "ziehen", gradient: ["#1e3a5f", "#2d5a87"], accent: "#f0c040" },
  { num: 2, title: "Alles mitgebracht?", emoji: "🎂", verb: "bringen", gradient: ["#5f1e3a", "#873a5a"], accent: "#f0a0c0" },
  { num: 3, title: "Man nehme, so man hat", emoji: "🎲", verb: "nehmen", gradient: ["#1e5f3a", "#2d8760"], accent: "#a0f0c0" },
  { num: 4, title: "Genau an diese Stelle", emoji: "📋", verb: "stellen", gradient: ["#3a3a5f", "#5a5a87"], accent: "#c0c0f0" },
  { num: 5, title: "Einfach drüberstehen", emoji: "☕", verb: "stehen", gradient: ["#5f4a1e", "#87702d"], accent: "#f0d080" },
  { num: 6, title: "Viele Übergaben", emoji: "🤝", verb: "geben", gradient: ["#1e5f5f", "#2d8787"], accent: "#80f0f0" },
  { num: 7, title: "Setz dich dazu", emoji: "🪑", verb: "setzen", gradient: ["#4a1e5f", "#702d87"], accent: "#d080f0" },
  { num: 8, title: "Liegt alles bereit?", emoji: "📰", verb: "legen", gradient: ["#5f2d1e", "#874a2d"], accent: "#f0b080" },
  { num: 9, title: "Endlich runterkommen", emoji: "🛋️", verb: "kommen", gradient: ["#1e4a5f", "#2d7087"], accent: "#80d0f0" },
  { num: 10, title: "Nerven behalten", emoji: "🚋", verb: "halten", gradient: ["#5f1e1e", "#872d2d"], accent: "#f08080" },
  { num: 11, title: "Im Studio geht es ab", emoji: "💪", verb: "gehen", gradient: ["#3a5f1e", "#5a872d"], accent: "#c0f080" },
  { num: 12, title: "Mach Licht an!", emoji: "💡", verb: "machen", gradient: ["#5f5f1e", "#87872d"], accent: "#f0f080" },
];

for (const m of modules) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="800" height="200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${m.gradient[0]}"/>
      <stop offset="100%" style="stop-color:${m.gradient[1]}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${m.accent};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:${m.accent};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="200" rx="12" fill="url(#bg)"/>
  <!-- Decorative circles -->
  <circle cx="700" cy="40" r="80" fill="${m.accent}" opacity="0.08"/>
  <circle cx="650" cy="160" r="120" fill="${m.accent}" opacity="0.05"/>
  <circle cx="100" cy="180" r="60" fill="${m.accent}" opacity="0.06"/>
  <!-- Accent bar -->
  <rect x="0" y="0" width="6" height="200" rx="3" fill="${m.accent}" opacity="0.8"/>
  <!-- Module number -->
  <text x="40" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="${m.accent}" opacity="0.9" font-weight="600">MODUL ${m.num}</text>
  <!-- Title -->
  <text x="40" y="95" font-family="system-ui, -apple-system, sans-serif" font-size="32" fill="white" font-weight="700">${m.title}</text>
  <!-- Verb -->
  <text x="40" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="white" opacity="0.7" font-style="italic">${m.verb}</text>
  <!-- Emoji -->
  <text x="680" y="120" font-size="64" text-anchor="middle">${m.emoji}</text>
</svg>`;

  writeFileSync(`public/images/story-${String(m.num).padStart(2, "0")}.svg`, svg, "utf8");
}

console.log("Generated 12 SVG story images in public/images/");
