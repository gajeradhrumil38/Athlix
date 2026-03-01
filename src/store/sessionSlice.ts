import { StateCreator } from 'zustand'
import { WorkoutSession, WorkoutSet } from '@/types'

export interface SessionSlice {
  activeSession: WorkoutSession | null
  activeSets: WorkoutSet[]
  setActiveSession: (session: WorkoutSession | null) => void
  setActiveSets: (sets: WorkoutSet[]) => void
  addSet: (set: WorkoutSet) => void
  clearSession: () => void
}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  activeSession: null,
  activeSets: [],
  setActiveSession: (session) => set({ activeSession: session }),
  setActiveSets: (sets) => set({ activeSets: sets }),
  addSet: (newSet) =>
    set((state) => ({
      activeSets: [...state.activeSets, newSet],
    })),
  clearSession: () =>
    set({
      activeSession: null,
      activeSets: [],
    }),
})
