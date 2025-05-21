import { ScoreRecord } from "@/types/quiz";

const STORAGE_KEY = "quiz_scores";

export function saveScore(score: Omit<ScoreRecord, "id">): ScoreRecord {
  const scores = getScores();
  const newScore: ScoreRecord = {
    ...score,
    id: crypto.randomUUID(),
  };
  
  scores.push(newScore);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  
  return newScore;
}

export function getScores(): ScoreRecord[] {
  if (typeof window === "undefined") return [];
  
  const scores = localStorage.getItem(STORAGE_KEY);
  if (!scores) return [];
  
  try {
    return JSON.parse(scores);
  } catch {
    return [];
  }
}

export function clearScores(): void {
  localStorage.removeItem(STORAGE_KEY);
} 