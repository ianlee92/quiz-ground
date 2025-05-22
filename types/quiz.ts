export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  created_at?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  isComplete: boolean;
}

export interface ScoreRecord {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  date: string;
  timeSpent: number; // 초 단위
  created_at?: string;
} 