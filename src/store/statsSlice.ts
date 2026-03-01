import { StateCreator } from 'zustand'
import { DailyStats, WeeklyStats } from '@/types'

export interface StatsSlice {
  todayStats: DailyStats | null
  weeklyStats: WeeklyStats | null
  setTodayStats: (stats: DailyStats | null) => void
  setWeeklyStats: (stats: WeeklyStats | null) => void
}

export const createStatsSlice: StateCreator<StatsSlice> = (set) => ({
  todayStats: null,
  weeklyStats: null,
  setTodayStats: (stats) => set({ todayStats: stats }),
  setWeeklyStats: (stats) => set({ weeklyStats: stats }),
})
