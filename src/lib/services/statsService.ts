import { supabase } from '@/lib/supabase'
import { DailyStats, WeeklyStats } from '@/types'
import { formatDate, getWeekDates } from '@/lib/utils'

export const statsService = {
  async getTodayStats(userId: string): Promise<DailyStats | null> {
    const today = formatDate(new Date())

    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle()

    if (error) throw error
    return data
  },

  async getWeeklyStats(userId: string): Promise<WeeklyStats> {
    const weekDates = getWeekDates()
    const startDate = formatDate(weekDates[0])
    const endDate = formatDate(weekDates[weekDates.length - 1])

    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (error) throw error

    const dayStats = data || []

    const totalSessions = dayStats.reduce((sum, day) => sum + day.sessions_count, 0)
    const totalDuration = dayStats.reduce((sum, day) => sum + day.total_duration_seconds, 0)
    const totalVolume = dayStats.reduce((sum, day) => sum + day.total_volume, 0)
    const totalCalories = dayStats.reduce((sum, day) => sum + day.calories_burned, 0)

    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = formatDate(checkDate)

      const { data: dayData } = await supabase
        .from('daily_stats')
        .select('sessions_count')
        .eq('user_id', userId)
        .eq('date', dateStr)
        .maybeSingle()

      if (dayData && dayData.sessions_count > 0) {
        streak++
      } else {
        break
      }
    }

    return {
      totalSessions,
      totalDuration,
      totalVolume,
      totalCalories,
      streak,
      dayStats,
    }
  },

  async updateDailyStats(userId: string, date: string): Promise<DailyStats> {
    const { data: sessions, error: sessionsError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('started_at', `${date}T00:00:00`)
      .lte('started_at', `${date}T23:59:59`)

    if (sessionsError) throw sessionsError

    const sessionsCount = sessions?.length || 0
    const totalDuration = sessions?.reduce((sum, s) => sum + s.total_duration_seconds, 0) || 0
    const totalVolume = sessions?.reduce((sum, s) => sum + s.total_volume, 0) || 0
    const caloriesBurned = sessions?.reduce((sum, s) => sum + s.calories_burned, 0) || 0

    const { data: sets, error: setsError } = await supabase
      .from('workout_sets')
      .select('exercise_id')
      .in('session_id', sessions?.map((s) => s.id) || [])

    if (setsError) throw setsError

    const exercisesCompleted = new Set(sets?.map((s) => s.exercise_id) || []).size

    const { data, error } = await supabase
      .from('daily_stats')
      .upsert({
        user_id: userId,
        date,
        sessions_count: sessionsCount,
        total_duration_seconds: totalDuration,
        total_volume: totalVolume,
        calories_burned: caloriesBurned,
        exercises_completed: exercisesCompleted,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' })
      .select()
      .single()

    if (error) throw error
    return data
  },
}
