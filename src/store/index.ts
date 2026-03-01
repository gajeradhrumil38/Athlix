import { create } from 'zustand'
import { createSessionSlice, SessionSlice } from './sessionSlice'
import { createStatsSlice, StatsSlice } from './statsSlice'
import { createTemplateSlice, TemplateSlice } from './templateSlice'

type StoreState = SessionSlice & StatsSlice & TemplateSlice

export const useStore = create<StoreState>()((...a) => ({
  ...createSessionSlice(...a),
  ...createStatsSlice(...a),
  ...createTemplateSlice(...a),
}))

export const selectActiveSession = (state: StoreState) => state.activeSession
export const selectActiveSets = (state: StoreState) => state.activeSets
export const selectTodayStats = (state: StoreState) => state.todayStats
export const selectWeeklyStats = (state: StoreState) => state.weeklyStats
export const selectActiveTemplate = (state: StoreState) => state.activeTemplate
export const selectTodayWorkout = (state: StoreState) => state.todayWorkout
