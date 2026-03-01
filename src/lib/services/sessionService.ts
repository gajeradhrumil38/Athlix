import { supabase } from '@/lib/supabase'
import { WorkoutSession, WorkoutSet } from '@/types'
import { formatDate } from '@/lib/utils'

export const sessionService = {
  async getTodaySession(userId: string): Promise<WorkoutSession | null> {
    const today = formatDate(new Date())
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('started_at', `${today}T00:00:00`)
      .lte('started_at', `${today}T23:59:59`)
      .maybeSingle()

    if (error) throw error
    return data
  },

  async getActiveSession(userId: string): Promise<WorkoutSession | null> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()

    if (error) throw error
    return data
  },

  async listSessionsByRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<WorkoutSession[]> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('started_at', `${startDate}T00:00:00`)
      .lte('started_at', `${endDate}T23:59:59`)
      .order('started_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(
    userId: string,
    workoutName: string,
    templateWorkoutId?: string
  ): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userId,
        workout_name: workoutName,
        template_workout_id: templateWorkoutId || null,
        status: 'active',
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(
    sessionId: string,
    updates: Partial<WorkoutSession>
  ): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async complete(sessionId: string, totalVolume: number, caloriesBurned: number): Promise<WorkoutSession> {
    const completedAt = new Date().toISOString()
    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .select('started_at')
      .eq('id', sessionId)
      .single()

    if (sessionError) throw sessionError

    const startTime = new Date(session.started_at).getTime()
    const endTime = new Date(completedAt).getTime()
    const durationSeconds = Math.floor((endTime - startTime) / 1000)

    const { data, error } = await supabase
      .from('workout_sessions')
      .update({
        status: 'completed',
        completed_at: completedAt,
        total_duration_seconds: durationSeconds,
        total_volume: totalVolume,
        calories_burned: caloriesBurned,
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getSessionSets(sessionId: string): Promise<WorkoutSet[]> {
    const { data, error } = await supabase
      .from('workout_sets')
      .select('*, exercise:exercises(*)')
      .eq('session_id', sessionId)
      .order('completed_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async addSet(
    sessionId: string,
    exerciseId: string,
    setNumber: number,
    reps: number,
    weight: number
  ): Promise<WorkoutSet> {
    const { data, error } = await supabase
      .from('workout_sets')
      .insert({
        session_id: sessionId,
        exercise_id: exerciseId,
        set_number: setNumber,
        reps,
        weight,
        completed_at: new Date().toISOString(),
      })
      .select('*, exercise:exercises(*)')
      .single()

    if (error) throw error
    return data
  },
}
