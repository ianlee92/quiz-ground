import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRecord } from "@/types/quiz";
import { Trophy } from "lucide-react";

interface ScoreBoardProps {
  scores: ScoreRecord[];
}

export function ScoreBoard({ scores }: ScoreBoardProps) {
  // 12시간 이내의 점수만 필터링
  const recentScores = scores.filter(score => {
    const scoreDate = new Date(score.date);
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
    return scoreDate >= twelveHoursAgo;
  });

  // 각 플레이어의 최고 점수만 선택
  const highestScores = recentScores.reduce((acc, current) => {
    const existingScore = acc.find(score => score.player_name === current.player_name);
    
    if (!existingScore) {
      // 새로운 플레이어의 점수 추가
      return [...acc, current];
    }
    
    // 기존 점수와 비교하여 더 높은 점수만 유지
    if (current.score > existingScore.score || 
        (current.score === existingScore.score && current.time_spent < existingScore.time_spent)) {
      return acc.map(score => 
        score.player_name === current.player_name ? current : score
      );
    }
    
    return acc;
  }, [] as ScoreRecord[]);

  // 점수와 시간으로 정렬
  const sortedScores = [...highestScores].sort((a, b) => {
    if (a.score === b.score) {
      return a.time_spent - b.time_spent;
    }
    return b.score - a.score;
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <CardTitle>오늘의 랭킹</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedScores.length === 0 ? (
            <p className="text-center text-muted-foreground">아직 기록이 없습니다.</p>
          ) : (
            sortedScores.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{score.player_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(score.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {score.score} / {score.total_questions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(score.time_spent / 60)}분 {score.time_spent % 60}초
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 