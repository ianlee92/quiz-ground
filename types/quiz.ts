export interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
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
} 