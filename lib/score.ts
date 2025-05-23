import { supabase } from './supabase'
import { ScoreRecord } from '@/types/quiz'

export async function saveScore(score: Omit<ScoreRecord, 'id' | 'created_at'>): Promise<ScoreRecord> {
  const { data, error } = await supabase
    .from('scores')
    .insert([score])
    .select()
    .single()

  if (error) {
    console.error('Error saving score:', error)
    throw error
  }

  return data
}

export async function getScores(): Promise<ScoreRecord[]> {
  // 12시간 전의 시간을 계산
  const twelveHoursAgo = new Date()
  twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12)

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .gte('date', twelveHoursAgo.toISOString()) // 12시간 이내의 점수만 가져오기
    .order('score', { ascending: false })
    .order('time_spent', { ascending: true })

  if (error) {
    console.error('Error fetching scores:', error)
    throw error
  }

  return data || []
} 