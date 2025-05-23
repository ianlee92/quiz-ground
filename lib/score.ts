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
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching scores:', error)
    throw error
  }

  return data || []
} 