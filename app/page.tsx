"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Timer } from "@/components/quiz/Timer";
import { ScoreBoard } from "@/components/quiz/ScoreBoard";
import { Input } from "@/components/ui/input";
import { QuizState, ScoreRecord, Quiz } from "@/types/quiz";
import { saveScore, getScores } from "@/lib/score";
import { getQuizzes } from "@/lib/quiz";
import { toast } from "sonner";

const TIME_PER_QUESTION = 30; // 각 문제당 30초

export default function Home() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isComplete: false,
  });
  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [showRanking, setShowRanking] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedScores, loadedQuizzes] = await Promise.all([
          getScores(),
          getQuizzes()
        ]);
        setScores(loadedScores);
        setQuizzes(loadedQuizzes);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">로딩 중...</h2>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">퀴즈가 없습니다.</h2>
        </div>
      </div>
    );
  }

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

  const handleTimeUp = () => {
    // 이미 답변을 선택한 경우 무시
    if (quizState.answers[quizState.currentQuestionIndex] !== undefined) {
      return;
    }

    // 시간 초과 시 자동으로 다음 문제로
    setQuizState(prev => {
      const newAnswers = [...prev.answers, -1]; // -1은 시간 초과를 의미
      
      // 마지막 문제인 경우 퀴즈 완료
      if (prev.currentQuestionIndex === quizzes.length - 1) {
        return {
          ...prev,
          answers: newAnswers,
          isComplete: true,
        };
      }

      // 다음 문제로 이동
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        answers: newAnswers,
      };
    });
  };

  const handleRestart = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isComplete: false,
    });
    setPlayerName("");
    setStartTime(Date.now());
    setShowRanking(false);
  };

  const handleSaveScore = async () => {
    if (!playerName.trim()) return;
    
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const newScore = await saveScore({
        playerName: playerName.trim(),
        score: quizState.score,
        totalQuestions: quizzes.length,
        date: new Date().toISOString(),
        timeSpent,
      });
      
      setScores(prev => [...prev, newScore]);
      setShowRanking(true);
      toast.success('점수가 저장되었습니다!');
    } catch (error) {
      console.error('Error saving score:', error);
      toast.error('점수 저장에 실패했습니다.');
    }
  };

  if (showRanking) {
    return (
      <div className="container max-w-2xl mx-auto p-4 min-h-screen">
        <div className="space-y-6">
          <ScoreBoard scores={scores} />
          <div className="flex justify-center">
            <Button onClick={handleRestart} size="lg">
              다시 시작하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (quizState.isComplete) {
    return (
      <div className="container max-w-2xl mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">퀴즈 완료!</h1>
          <p className="text-xl md:text-2xl">
            최종 점수: {quizState.score} / {quizzes.length}
          </p>
          <div className="space-y-4">
            <Input
              placeholder="이름을 입력하세요"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="max-w-xs mx-auto"
            />
            <div className="flex gap-4 justify-center">
              <Button onClick={handleSaveScore} size="lg" disabled={!playerName.trim()}>
                점수 저장하기
              </Button>
              <Button onClick={handleRestart} size="lg" variant="outline">
                다시 시작하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 min-h-screen">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">퀴즈</h1>
            <p className="text-sm md:text-base">
              {quizState.currentQuestionIndex + 1} / {quizzes.length}
            </p>
          </div>
          <Progress value={progress} className="h-2" />
          <Timer
            duration={TIME_PER_QUESTION}
            onTimeUp={handleTimeUp}
            isActive={quizState.answers[quizState.currentQuestionIndex] === undefined}
            questionId={currentQuiz.id}
          />
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
