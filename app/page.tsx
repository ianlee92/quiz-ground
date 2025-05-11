"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizCard } from "@/components/quiz/QuizCard";
import { quizzes } from "@/data/quizzes";
import { QuizState } from "@/types/quiz";

export default function Home() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isComplete: false,
  });

  const currentQuiz = quizzes[quizState.currentQuestionIndex];
  const progress = (quizState.currentQuestionIndex / quizzes.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const isCorrect = answerIndex === currentQuiz.correctAnswer;
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;
    
    setQuizState(prev => ({
      ...prev,
      score: newScore,
      answers: [...prev.answers, answerIndex],
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < quizzes.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        isComplete: true,
      }));
    }
  };

  const handleRestart = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isComplete: false,
    });
  };

  if (quizState.isComplete) {
    return (
      <div className="container max-w-2xl mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">퀴즈 완료!</h1>
          <p className="text-xl md:text-2xl">
            최종 점수: {quizState.score} / {quizzes.length}
          </p>
          <Button onClick={handleRestart} size="lg">
            다시 시작하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 min-h-screen">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">퀴즈</h1>
            <p className="text-sm md:text-base">
              {quizState.currentQuestionIndex + 1} / {quizzes.length}
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <QuizCard
          quiz={currentQuiz}
          selectedAnswer={quizState.answers[quizState.currentQuestionIndex] ?? null}
          onAnswerSelect={handleAnswerSelect}
          showExplanation={quizState.answers[quizState.currentQuestionIndex] !== undefined}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={quizState.answers[quizState.currentQuestionIndex] === undefined}
            size="lg"
          >
            {quizState.currentQuestionIndex === quizzes.length - 1 ? "완료" : "다음"}
          </Button>
        </div>
      </div>
    </div>
  );
}
