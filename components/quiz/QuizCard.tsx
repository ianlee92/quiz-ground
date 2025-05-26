import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Quiz } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: Quiz;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  showExplanation: boolean;
}

export function QuizCard({ quiz, selectedAnswer, onAnswerSelect, showExplanation }: QuizCardProps) {
  const isCorrect = selectedAnswer === quiz.correct_answer;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{quiz.question}</CardTitle>
        <CardDescription>정답을 선택해주세요</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          key={quiz.id}
          value={selectedAnswer === null ? undefined : selectedAnswer.toString()}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
          className="space-y-3"
          disabled={selectedAnswer !== null}
        >
          {quiz.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${index}`}
                disabled={selectedAnswer !== null}
              />
              <Label
                htmlFor={`option-${index}`}
                className={cn(
                  "text-base md:text-lg cursor-pointer",
                  selectedAnswer !== null && "cursor-not-allowed"
                )}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {showExplanation && (
          <div className={cn(
            "mt-6 p-4 rounded-lg",
            isCorrect 
              ? "bg-green-50 dark:bg-green-950/50" 
              : "bg-red-50 dark:bg-red-950/50"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {isCorrect ? "🎉" : "❌"}
              </span>
              <span className="font-medium">
                {isCorrect ? "정답입니다!" : "오답입니다."}
              </span>
            </div>
            <p className="text-sm md:text-base">{quiz.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 