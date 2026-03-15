// ============================================
// Auf Deutsch Gesagt — Core Types
// ============================================

// --- Module & Content Schema ---

export interface SentenceTimestamp {
  start: number; // seconds
  end: number;
  text: string;
  displayText?: string; // optional rich text with **bold** markers for key words
}

export interface VocabItem {
  german: string;
  english: string;
  definition?: string; // German-language definition
  example?: string;
  audioFile?: string;
  partOfSpeech?: string;
}

export interface ExerciseBase {
  id: string;
  instruction: string;
  skill: "lesen" | "hoeren" | "sprechen" | "schreiben";
}

export interface GapFillExercise extends ExerciseBase {
  type: "gap-fill";
  sentences: {
    text: string; // use ___ for gaps
    answer: string;
  }[];
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multiple-choice";
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface TrueFalseExercise extends ExerciseBase {
  type: "true-false";
  statements: {
    statement: string;
    correct: boolean;
  }[];
}

export interface MatchingExercise extends ExerciseBase {
  type: "matching";
  pairs: {
    left: string;
    right: string;
  }[];
}

export interface OpenWritingExercise extends ExerciseBase {
  type: "open-writing";
  prompt: string;
  mustUseWords?: string[];
  modelAnswer: string;
}

export interface SpeakingExercise extends ExerciseBase {
  type: "speaking";
  prompt: string;
  mustUseWords?: string[];
  modelAnswer: string;
}

export type Exercise =
  | GapFillExercise
  | MultipleChoiceExercise
  | TrueFalseExercise
  | MatchingExercise
  | OpenWritingExercise
  | SpeakingExercise;

export interface ReviewItem {
  fromModule: number;
  type: "vocab" | "idiom" | "verb";
  item: VocabItem;
}

export interface CourseModule {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  focusVerb: string;
  learningGoals: string[];
  estimatedMinutes: number;
  story: {
    text: string;
    paragraphs: string[];
    audioFile?: string;
    soundcloudUrl?: string;
    sentences: SentenceTimestamp[];
    headerImage?: string;
  };
  coreVerbs: VocabItem[];
  idioms: VocabItem[];
  exercises: Exercise[];
  reviewItems: ReviewItem[];
  isReviewModule?: boolean;
}

// --- User & Progress ---

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface SectionProgress {
  story: boolean;
  vocabulary: boolean;
  exercises: {
    lesen: boolean;
    hoeren: boolean;
    sprechen: boolean;
    schreiben: boolean;
  };
}

export interface ModuleProgress {
  moduleId: number;
  started: boolean;
  completed: boolean;
  sections: SectionProgress;
  exerciseAnswers: Record<string, unknown>;
  lastAccessed?: string;
}

export interface UserProgress {
  userId: string;
  modules: Record<number, ModuleProgress>;
  currentModule: number;
  flashcardsDue: string[]; // vocab item keys
}

// --- UI State ---

export interface AppState {
  user: User | null;
  progress: UserProgress | null;
  isPlaying: boolean;
  currentSentenceIndex: number;
}
