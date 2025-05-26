import { supabase } from './supabase'
import { ScoreRecord } from '@/types/quiz'

export async function saveScore(score: Omit<ScoreRecord, 'id' | 'created_at'>): Promise<ScoreRecord | null> {
  try {
    // 해당 플레이어의 같은 날짜 최고 점수를 확인
    const { data: existingScores, error: fetchError } = await supabase
      .from('scores')
      .select('*')
      .eq('player_name', score.player_name)
      .eq('date', score.date) // 같은 날짜의 점수만 확인
      .order('score', { ascending: false })
      .order('time_spent', { ascending: true })
      .limit(1)

    if (fetchError) {
      console.error('Error fetching existing score:', fetchError)
      throw fetchError
    }

    let result: ScoreRecord | null = null

    if (existingScores && existingScores.length > 0) {
      const existingScore = existingScores[0]
      
      // 새로운 점수가 더 좋거나 (점수가 같을 때는 시간이 더 빠른 경우) 업데이트
      if (score.score > existingScore.score || 
          (score.score === existingScore.score && score.time_spent < existingScore.time_spent)) {
        // 기존 점수 업데이트
        const { data, error } = await supabase
          .from('scores')
          .update(score)
          .eq('id', existingScore.id)
          .select()
          .single()

        if (error) {
          console.error('Error updating score:', error)
          throw error
        }

        if (!data) {
          throw new Error('점수 업데이트에 실패했습니다.')
        }

        result = data
      } else {
        // 더 좋은 기록이 있는 경우 null 반환
        return null
      }
    } else {
      // 새로운 점수 저장
      const { data, error } = await supabase
        .from('scores')
        .insert([score])
        .select()
        .single()

      if (error) {
        console.error('Error saving score:', error)
        throw error
      }

      if (!data) {
        throw new Error('점수 저장에 실패했습니다.')
      }

      result = data
    }

    return result
  } catch (error) {
    console.error('Error in saveScore:', error)
    throw error
  }
}

export async function getScores(): Promise<ScoreRecord[]> {
  try {
    // 오늘 날짜의 점수만 가져오기
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('date', today) // 오늘 날짜의 점수만 필터링
      .order('score', { ascending: false })
      .order('time_spent', { ascending: true })

    if (error) {
      console.error('Error fetching scores:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getScores:', error)
    throw error
  }
} 