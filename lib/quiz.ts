import { supabase } from './supabase'
import { Quiz } from '@/types/quiz'

export async function getQuizzes(): Promise<Quiz[]> {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching quizzes:', error)
    throw error
  }

  return data || []
}

export async function addQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>): Promise<Quiz> {
  const { data, error } = await supabase
    .from('quizzes')
    .insert([quiz])
    .select()
    .single()

  if (error) {
    console.error('Error adding quiz:', error)
    throw error
  }

  return data
}

export async function updateQuiz(id: string, quiz: Partial<Quiz>): Promise<Quiz> {
  const { data, error } = await supabase
    .from('quizzes')
    .update(quiz)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating quiz:', error)
    throw error
  }

  return data
}

export async function deleteQuiz(id: string): Promise<void> {
  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting quiz:', error)
    throw error
  }
} 