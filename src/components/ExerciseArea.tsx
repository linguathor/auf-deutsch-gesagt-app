"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Check,
  X,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Volume2,
  Star,
  MicOff,
} from "lucide-react";
import { Exercise } from "@/types";
import { useTTS } from "@/lib/use-tts";

interface ExerciseAreaProps {
  exercises: Exercise[];
  onSkillComplete?: (skill: string) => void;
}

const skillTabs = [
  { key: "lesen", label: "Lesen", icon: BookOpen },
  { key: "hoeren", label: "Hören", icon: Headphones },
  { key: "sprechen", label: "Sprechen", icon: Mic },
  { key: "schreiben", label: "Schreiben", icon: PenTool },
] as const;

// Motivating messages shown on success
const successMessages = [
  "Ausgezeichnet! Weiter so! 🎉",
  "Super gemacht! Du bist auf dem richtigen Weg! 💪",
  "Fantastisch! Das sitzt! 🌟",
  "Perfekt! Du machst große Fortschritte! 🚀",
  "Toll! Das hast du drauf! ✨",
  "Bravo! Weiter so, du schaffst das! 🎯",
  "Klasse! Das war richtig gut! 🏆",
];

function getRandomSuccess() {
  return successMessages[Math.floor(Math.random() * successMessages.length)];
}

function SuccessCelebration({ message }: { message: string }) {
  return (
    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
        <Star className="w-5 h-5 text-gold-400" />
      </div>
      <p className="text-emerald-400 font-medium text-sm">{message}</p>
    </div>
  );
}

export default function ExerciseArea({ exercises, onSkillComplete }: ExerciseAreaProps) {
  const [activeSkill, setActiveSkill] = useState<string>("lesen");

  const filteredExercises = exercises.filter((e) => e.skill === activeSkill);

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Übungen</h3>

      {/* Skill tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {skillTabs.map(({ key, label, icon: Icon }) => {
          const count = exercises.filter((e) => e.skill === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveSkill(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeSkill === key
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "bg-navy-800/50 text-muted hover:text-foreground border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count > 0 && (
                <span className="text-xs bg-navy-700 px-1.5 py-0.5 rounded">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Exercises */}
      <div className="space-y-6">
        {filteredExercises.length === 0 ? (
          <p className="text-muted text-sm italic">
            Keine Übungen in dieser Kategorie noch verfügbar.
          </p>
        ) : (
          filteredExercises.map((exercise) => (
            <ExerciseRenderer
              key={exercise.id}
              exercise={exercise}
              onComplete={() => onSkillComplete?.(exercise.skill)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ExerciseRenderer({
  exercise,
  onComplete,
}: {
  exercise: Exercise;
  onComplete?: () => void;
}) {
  switch (exercise.type) {
    case "multiple-choice":
      return <MultipleChoiceExercise exercise={exercise} onComplete={onComplete} />;
    case "true-false":
      return <TrueFalseExercise exercise={exercise} onComplete={onComplete} />;
    case "gap-fill":
      return <GapFillExercise exercise={exercise} onComplete={onComplete} />;
    case "matching":
      return <MatchingExercise exercise={exercise} onComplete={onComplete} />;
    case "open-writing":
      return <WritingExercise exercise={exercise} onComplete={onComplete} />;
    case "speaking":
      return <SpeakingExercise exercise={exercise} onComplete={onComplete} />;
    default:
      return null;
  }
}

// --- Multiple Choice ---
function MultipleChoiceExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "multiple-choice" }>;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = exercise.questions.every(
      (q, i) => answers[i] === q.correctIndex
    );
    if (allCorrect) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setChecked(false);
    setSuccessMsg(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      {exercise.questions.map((q, qIdx) => (
        <div key={qIdx} className="space-y-2">
          <p className="text-sm text-foreground font-medium">
            {qIdx + 1}. {q.question}
          </p>
          <div className="grid gap-2">
            {q.options.map((opt, oIdx) => {
              const isSelected = answers[qIdx] === oIdx;
              const isCorrect = q.correctIndex === oIdx;
              let cls =
                "w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ";
              if (checked && isSelected && isCorrect) {
                cls += "border-emerald-500 bg-emerald-500/10 text-emerald-400";
              } else if (checked && isSelected && !isCorrect) {
                cls += "border-coral-500 bg-coral-500/10 text-coral-400";
              } else if (checked && isCorrect) {
                cls += "border-emerald-500/50 bg-emerald-500/5 text-muted";
              } else if (isSelected) {
                cls += "border-gold-500 bg-gold-500/10 text-foreground";
              } else {
                cls +=
                  "border-border bg-navy-800/30 text-muted hover:border-gold-500/30 hover:text-foreground";
              }
              return (
                <button key={oIdx} onClick={() => handleSelect(qIdx, oIdx)} className={cls} disabled={checked}>
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                      {checked && isSelected && isCorrect && <Check className="w-3 h-3" />}
                      {checked && isSelected && !isCorrect && <X className="w-3 h-3" />}
                      {!checked && String.fromCharCode(65 + oIdx)}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={Object.keys(answers).length < exercise.questions.length}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Überprüfen <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- True/False ---
function TrueFalseExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "true-false" }>;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSelect = (idx: number, value: boolean) => {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = exercise.statements.every(
      (s, i) => answers[i] === s.correct
    );
    if (allCorrect) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setChecked(false);
    setSuccessMsg(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      {exercise.statements.map((stmt, idx) => (
        <div key={idx} className="flex items-start gap-3 p-3 bg-navy-800/30 rounded-lg border border-border/50">
          <span className="text-sm text-foreground flex-1">{stmt.statement}</span>
          <div className="flex gap-2 shrink-0">
            {[true, false].map((val) => {
              const isSel = answers[idx] === val;
              let cls = "px-3 py-1 rounded text-xs font-medium border transition-all ";
              if (checked && isSel && val === stmt.correct) {
                cls += "border-emerald-500 bg-emerald-500/20 text-emerald-400";
              } else if (checked && isSel && val !== stmt.correct) {
                cls += "border-coral-500 bg-coral-500/20 text-coral-400";
              } else if (isSel) {
                cls += "border-gold-500 bg-gold-500/10 text-gold-400";
              } else {
                cls += "border-border text-muted hover:border-gold-500/30";
              }
              return (
                <button key={String(val)} onClick={() => handleSelect(idx, val)} className={cls} disabled={checked}>
                  {val ? "Richtig" : "Falsch"}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={Object.keys(answers).length < exercise.statements.length}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Überprüfen <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- Gap Fill ---
function GapFillExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "gap-fill" }>;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { speak } = useTTS();

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = exercise.sentences.every(
      (s, i) => (answers[i] || "").trim().toLowerCase() === s.answer.toLowerCase()
    );
    if (allCorrect) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setChecked(false);
    setSuccessMsg(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      {exercise.skill === "hoeren" && (
        <p className="text-xs text-sky-400 italic">
          Tipp: Klicke auf 🔊 um den Satz anzuhören und überprüfe deine Antwort anhand der Aufnahme.
        </p>
      )}
      {exercise.sentences.map((sent, idx) => {
        const isCorrect =
          checked &&
          (answers[idx] || "").trim().toLowerCase() === sent.answer.toLowerCase();
        const isWrong = checked && !isCorrect;
        return (
          <div key={idx} className="flex items-center gap-3">
            {exercise.skill === "hoeren" && (
              <button
                onClick={() => speak(sent.text.replace("___", sent.answer))}
                className="text-gold-500 hover:text-gold-400 transition-colors shrink-0"
                title="Satz anhören"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <p className="text-sm text-foreground flex-1">
              {sent.text.split("___").map((part, pIdx, arr) => (
                <span key={pIdx}>
                  {part}
                  {pIdx < arr.length - 1 && (
                    <input
                      type="text"
                      value={answers[idx] || ""}
                      onChange={(e) =>
                        !checked &&
                        setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                      }
                      className={`inline-block w-28 mx-1 px-2 py-0.5 rounded border text-sm bg-navy-800 outline-none transition-colors ${
                        isCorrect
                          ? "border-emerald-500 text-emerald-400"
                          : isWrong
                          ? "border-coral-500 text-coral-400"
                          : "border-border text-foreground focus:border-gold-500"
                      }`}
                      placeholder="..."
                      readOnly={checked}
                    />
                  )}
                </span>
              ))}
            </p>
            {checked && (
              <span className="text-xs">
                {isCorrect ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-coral-400">{sent.answer}</span>
                )}
              </span>
            )}
          </div>
        );
      })}
      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 flex items-center gap-2"
          >
            Überprüfen <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- Matching ---
function MatchingExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "matching" }>;
  onComplete?: () => void;
}) {
  const { speak } = useTTS();
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Shuffle right side (stable)
  const [shuffledRight] = useState(() => {
    const indices = exercise.pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  const handleLeftClick = (idx: number) => {
    if (checked) return;
    setSelectedLeft(idx);
  };

  const handleRightClick = (shuffledIdx: number) => {
    if (checked || selectedLeft === null) return;
    setMatches((prev) => ({ ...prev, [selectedLeft]: shuffledRight[shuffledIdx] }));
    setSelectedLeft(null);
  };

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = exercise.pairs.every((_, i) => matches[i] === i);
    if (allCorrect) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setMatches({});
    setChecked(false);
    setSelectedLeft(null);
    setSuccessMsg(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      {exercise.skill === "hoeren" && (
        <p className="text-xs text-sky-400 italic">
          Was ist damit gemeint? Verbinde die Ausdrücke mit den passenden Erklärungen.
        </p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {exercise.pairs.map((pair, idx) => {
            const isMatched = matches[idx] !== undefined;
            const isSelected = selectedLeft === idx;
            return (
              <button
                key={idx}
                onClick={() => handleLeftClick(idx)}
                disabled={checked}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                  isSelected
                    ? "border-gold-500 bg-gold-500/10 text-gold-400"
                    : isMatched
                    ? "border-sky-500/30 bg-sky-500/5 text-sky-400"
                    : "border-border bg-navy-800/30 text-foreground hover:border-gold-500/30"
                }`}
              >
                <span className="flex items-center gap-2">
                  {exercise.skill === "hoeren" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(pair.left);
                      }}
                      className="text-gold-500 hover:text-gold-400 shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {pair.left}
                </span>
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {shuffledRight.map((origIdx, shuffIdx) => {
            const isMatched = Object.values(matches).includes(origIdx);
            const matchedCorrectly = checked && Object.entries(matches).find(
              ([left, right]) => Number(right) === origIdx && Number(left) === origIdx
            );
            const matchedWrongly = checked && isMatched && !matchedCorrectly;
            return (
              <button
                key={shuffIdx}
                onClick={() => handleRightClick(shuffIdx)}
                disabled={checked}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                  matchedCorrectly
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : matchedWrongly
                    ? "border-coral-500 bg-coral-500/10 text-coral-400"
                    : isMatched
                    ? "border-sky-500/30 bg-sky-500/5 text-sky-400"
                    : "border-border bg-navy-800/30 text-foreground hover:border-gold-500/30"
                }`}
              >
                {exercise.pairs[origIdx].right}
              </button>
            );
          })}
        </div>
      </div>
      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={Object.keys(matches).length < exercise.pairs.length}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Überprüfen <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- Open Writing ---
function WritingExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "open-writing" }>;
  onComplete?: () => void;
}) {
  const [text, setText] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { speak } = useTTS();

  const handleSubmit = () => {
    if (text.trim().length < 10) return;
    setSubmitted(true);
    setShowFeedback(true);
    onComplete?.();
  };

  const usedWords = exercise.mustUseWords?.filter((w) =>
    text.toLowerCase().includes(w.toLowerCase())
  ) || [];

  const missingWords = exercise.mustUseWords?.filter(
    (w) => !text.toLowerCase().includes(w.toLowerCase())
  ) || [];

  const handleReset = () => {
    setText("");
    setSubmitted(false);
    setShowFeedback(false);
    setShowModel(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      <div className="bg-navy-800/30 rounded-lg p-4 border border-border/50">
        <p className="text-sm text-foreground mb-3">{exercise.prompt}</p>
        {exercise.mustUseWords && exercise.mustUseWords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-muted">Pflicht-Ausdrücke:</span>
            {exercise.mustUseWords.map((word, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded border ${
                  usedWords.includes(word)
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                    : "border-border text-muted"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => !submitted && setText(e.target.value)}
        placeholder="Schreibe hier..."
        rows={5}
        readOnly={submitted}
        className="w-full bg-navy-800 border border-border rounded-lg p-3 text-sm text-foreground placeholder-muted/50 resize-none outline-none focus:border-gold-500 transition-colors"
      />
      
      {/* Feedback area */}
      {showFeedback && (
        <div className="bg-navy-800/30 border border-border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-gold-400">Feedback</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-20 shrink-0">Inhalt:</span>
              <span className="text-xs text-foreground/80">
                {text.trim().split(/\s+/).length >= 20
                  ? "Gute Länge! Dein Text ist ausführlich genug."
                  : "Versuche, etwas mehr zu schreiben (mind. 20 Wörter)."}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-20 shrink-0">Vokabular:</span>
              <span className="text-xs text-foreground/80">
                {missingWords.length === 0
                  ? "Alle Pflicht-Ausdrücke verwendet! ✓"
                  : `Es fehlen noch: ${missingWords.join(", ")}`}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-20 shrink-0">Tipp:</span>
              <span className="text-xs text-foreground/80">
                Vergleiche deinen Text mit der Musterlösung, um deine Grammatik und den Inhalt zu überprüfen.
              </span>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <SuccessCelebration message="Text eingereicht! Vergleiche mit der Musterlösung. ✍️" />
      )}

      <div className="flex gap-2 flex-wrap">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={text.trim().length < 10}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Abschicken
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal schreiben
          </button>
        )}
        <button
          onClick={() => setShowModel(!showModel)}
          className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors"
        >
          {showModel ? "Musterlösung ausblenden" : "Musterlösung anzeigen"}
        </button>
      </div>
      {showModel && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-xs text-emerald-400 font-medium mb-2">Musterlösung:</p>
          <p className="text-sm text-foreground/80 cursor-pointer hover:text-gold-400 transition-colors" onClick={() => speak(exercise.modelAnswer)}>
            🔊 {exercise.modelAnswer}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Speaking ---
function SpeakingExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "speaking" }>;
  onComplete?: () => void;
}) {
  const [showModel, setShowModel] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const recognitionRef = useRef</* SpeechRecognition */ any>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const { speak } = useTTS();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "de-DE";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      let result = "";
      for (let i = 0; i < event.results.length; i++) {
        result += event.results[i][0].transcript;
      }
      setTranscript(result);
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  const handleMarkDone = () => {
    setCompleted(true);
    setShowFeedback(true);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    onComplete?.();
  };

  const handleReset = () => {
    setCompleted(false);
    setTranscript("");
    setShowFeedback(false);
    setShowModel(false);
  };

  const usedWords = exercise.mustUseWords?.filter((w) =>
    transcript.toLowerCase().includes(w.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      <div className="bg-navy-800/30 rounded-lg p-4 border border-border/50">
        <p className="text-sm text-foreground mb-3">{exercise.prompt}</p>
        {exercise.mustUseWords && exercise.mustUseWords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted">Pflicht-Ausdrücke:</span>
            {exercise.mustUseWords.map((word, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded border ${
                  usedWords.includes(word)
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                    : "border-border text-gold-400"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recording area */}
      <div className="flex items-center gap-4">
        {speechSupported ? (
          <button
            onClick={toggleRecording}
            disabled={completed}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-coral-500 hover:bg-coral-400 text-white animate-pulse"
                : "bg-gold-500/20 hover:bg-gold-500/30 text-gold-400"
            } ${completed ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        ) : (
          <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center">
            <Mic className="w-5 h-5 text-gold-400" />
          </div>
        )}
        <div className="text-sm text-muted flex-1">
          {isRecording ? (
            <span className="text-coral-400">Aufnahme läuft... Klicke zum Stoppen.</span>
          ) : speechSupported ? (
            <span>Klicke auf das Mikrofon zum Aufnehmen. Sprich laut und deutlich.</span>
          ) : (
            <span>Sprich laut und übe den Ausdruck. Wenn du fertig bist, klicke auf &quot;Erledigt&quot;.</span>
          )}
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-navy-800/50 border border-border/50 rounded-lg p-3">
          <p className="text-xs text-muted mb-1">Deine Aufnahme:</p>
          <p className="text-sm text-foreground">{transcript}</p>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="bg-navy-800/30 border border-border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-gold-400">Feedback</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-24 shrink-0">Vokabular:</span>
              <span className="text-xs text-foreground/80">
                {transcript
                  ? usedWords.length === (exercise.mustUseWords?.length ?? 0)
                    ? "Alle Pflicht-Ausdrücke erkannt! ✓"
                    : `Erkannte Ausdrücke: ${usedWords.length}/${exercise.mustUseWords?.length ?? 0}. Versuche die fehlenden Ausdrücke nochmal deutlicher.`
                  : "Keine Aufnahme erkannt. Überprüfe die Musterlösung."}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-24 shrink-0">Tipp:</span>
              <span className="text-xs text-foreground/80">
                Höre dir die Musterlösung an und vergleiche. Achte auf Aussprache und Betonung.
              </span>
            </div>
          </div>
        </div>
      )}

      {completed && <SuccessCelebration message="Gut gemacht! Vergleiche mit der Musterlösung. 🗣️" />}

      <div className="flex gap-2 flex-wrap">
        {!completed ? (
          <button
            onClick={handleMarkDone}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400"
          >
            Erledigt
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal sprechen
          </button>
        )}
        <button
          onClick={() => setShowModel(!showModel)}
          className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors"
        >
          {showModel ? "Musterlösung ausblenden" : "Musterlösung anzeigen"}
        </button>
      </div>
      {showModel && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-xs text-emerald-400 font-medium mb-2">Musterlösung:</p>
          <p className="text-sm text-foreground/80 cursor-pointer hover:text-gold-400 transition-colors" onClick={() => speak(exercise.modelAnswer)}>
            🔊 {exercise.modelAnswer}
          </p>
        </div>
      )}
    </div>
  );
}
