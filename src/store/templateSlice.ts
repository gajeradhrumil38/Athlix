import { StateCreator } from 'zustand'
import { Template, TemplateWorkout } from '@/types'

export interface TemplateSlice {
  activeTemplate: Template | null
  todayWorkout: TemplateWorkout | null
  setActiveTemplate: (template: Template | null) => void
  setTodayWorkout: (workout: TemplateWorkout | null) => void
}

export const createTemplateSlice: StateCreator<TemplateSlice> = (set) => ({
  activeTemplate: null,
  todayWorkout: null,
  setActiveTemplate: (template) => set({ activeTemplate: template }),
  setTodayWorkout: (workout) => set({ todayWorkout: workout }),
})
