import { useEffect, useState, useCallback, useRef } from "react";
import { Progress } from "@/components/ui/progress";

interface TimerProps {
  duration: number; // 초 단위
  onTimeUp: () => void;
  isActive: boolean;
  questionId: string; // Changed from number to string
}

export function Timer({ duration, onTimeUp, isActive, questionId }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<NodeJS.Timeout>();
  const hasTriggeredRef = useRef(false);

  const handleTick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          // setTimeout을 사용하여 다음 렌더링 사이클에서 onTimeUp 호출
          setTimeout(() => {
            onTimeUp();
          }, 0);
        }
        return 0;
      }
      return prev - 1;
    });
  }, [onTimeUp]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    hasTriggeredRef.current = false;
    timerRef.current = setInterval(handleTick, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, handleTick]);

  // 문제가 변경될 때마다 타이머 리셋
  useEffect(() => {
    setTimeLeft(duration);
    hasTriggeredRef.current = false;
  }, [duration, questionId]);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span>남은 시간</span>
        <span className="font-medium">{timeLeft}초</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
} 