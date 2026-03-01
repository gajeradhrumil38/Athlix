export interface Exercise {
  id: string
  name: string
  category: 'strength' | 'cardio' | 'flexibility'
  muscle_group: string | null
  equipment: string | null
  is_custom: boolean
  user_id: string | null
  created_at: string
}

export interface WorkoutSet {
  id: string
  session_id: string
  exercise_id: string
  set_number: number
  reps: number
  weight: number
  duration_seconds: number
  completed_at: string
  exercise?: Exercise
}

export interface WorkoutSession {
  id: string
  user_id: string
  template_workout_id: string | null
  workout_name: string
  status: 'active' | 'completed' | 'abandoned'
  started_at: string
  completed_at: string | null
  total_duration_seconds: number
  total_volume: number
  calories_burned: number
  notes: string | null
}

export interface TemplateExercise {
  id: string
  template_workout_id: string
  exercise_id: string
  order_index: number
  target_sets: number
  target_reps: number | null
  target_weight: number | null
  rest_seconds: number
  created_at: string
  exercise?: Exercise
}

export interface TemplateWorkout {
  id: string
  template_id: string
  cycle_day: number
  workout_name: string
  created_at: string
  exercises?: TemplateExercise[]
}

export interface Template {
  id: string
  user_id: string
  name: string
  description: string | null
  cycle_length: number
  is_active: boolean
  activated_at: string | null
  created_at: string
  workouts?: TemplateWorkout[]
}

export interface DailyStats {
  id: string
  user_id: string
  date: string
  sessions_count: number
  total_duration_seconds: number
  total_volume: number
  calories_burned: number
  exercises_completed: number
  updated_at: string
}

export interface WeeklyStats {
  totalSessions: number
  totalDuration: number
  totalVolume: number
  totalCalories: number
  streak: number
  dayStats: DailyStats[]
}

export type SessionState = 'EMPTY' | 'PLANNED' | 'ACTIVE' | 'COMPLETED'

export interface SessionExercise {
  exercise: Exercise
  targetSets: number
  targetReps: number | null
  targetWeight: number | null
  restSeconds: number
  completedSets: WorkoutSet[]
}
