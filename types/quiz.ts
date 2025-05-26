export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  created_at?: string;
  available_date: string; // YYYY-MM-DD format
  is_active: boolean; // 퀴즈 활성화 여부
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  isComplete: boolean;
}

export interface ScoreRecord {
  id?: string;
  player_name: string;
  score: number;
  total_questions: number;
  date: string;
  time_spent: number;
  created_at?: string;
  avatar_url?: string;
} 