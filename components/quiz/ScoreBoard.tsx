import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRecord } from "@/types/quiz";
import { Trophy } from "lucide-react";

interface ScoreBoardProps {
  scores: ScoreRecord[];
}

export function ScoreBoard({ scores }: ScoreBoardProps) {
  const sortedScores = [...scores].sort((a, b) => {
    // 점수가 같으면 시간이 적은 순으로 정렬
    if (a.score === b.score) {
      return a.timeSpent - b.timeSpent;
    }
    return b.score - a.score;
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <CardTitle>랭킹</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedScores.map((score, index) => (
            <div
              key={score.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{score.playerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(score.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {score.score} / {score.totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.floor(score.timeSpent / 60)}분 {score.timeSpent % 60}초
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 