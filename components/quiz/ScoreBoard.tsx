import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRecord } from "@/types/quiz";
import { Trophy } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ScoreBoardProps {
  scores: ScoreRecord[];
}

export function ScoreBoard({ scores }: ScoreBoardProps) {
  // 각 플레이어의 최고 점수만 선택
  const highestScores = scores.reduce((acc, current) => {
    const existingScore = acc.find(score => score.player_name === current.player_name);
    
    if (!existingScore) {
      return [...acc, current];
    }
    
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

  // 오늘 날짜 포맷팅
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <CardTitle>{today} 랭킹</CardTitle>
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
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={score.avatar_url || ''} 
                        alt={score.player_name}
                      />
                      <AvatarFallback>
                        {score.player_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{score.player_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(score.date).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
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