import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExerciseControls } from '@/components/workout/ExerciseControls'
import { RestTimer } from '@/components/workout/RestTimer'
import { SetHistory } from '@/components/workout/SetHistory'
import { useStore } from '@/store'
import { sessionService } from '@/lib/services/sessionService'
import { exerciseService } from '@/lib/services/exerciseService'
import { statsService } from '@/lib/services/statsService'
import { supabase } from '@/lib/supabase'
import { WorkoutSet, Exercise } from '@/types'
import { formatDate } from '@/lib/utils'

export function Workout() {
  const navigate = useNavigate()
  const { activeSession, activeSets, setActiveSession, setActiveSets, addSet, clearSession } =
    useStore()

  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [resting, setResting] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [exerciseSets, setExerciseSets] = useState<WorkoutSet[]>([])

  useEffect(() => {
    const initializeWorkout = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          navigate('/')
          return
        }

        setUserId(user.id)

        let session = activeSession

        if (!session) {
          session = await sessionService.getActiveSession(user.id)
        }

        if (!session) {
          session = await sessionService.create(user.id, 'Quick Workout')
          setActiveSession(session)
        } else {
          setActiveSession(session)
          const sets = await sessionService.getSessionSets(session.id)
          setActiveSets(sets)
        }

        const exercises = await exerciseService.list(user.id)
        if (exercises.length > 0) {
          setCurrentExercise(exercises[0])
        }
      } catch (error) {
        console.error('Failed to initialize workout:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeWorkout()
  }, [])

  useEffect(() => {
    if (currentExercise) {
      const sets = activeSets.filter((s) => s.exercise_id === currentExercise.id)
      setExerciseSets(sets)
    }
  }, [currentExercise, activeSets])

  const handleCompleteSet = async (reps: number, weight: number) => {
    if (!activeSession || !currentExercise || !userId) return

    try {
      const setNumber = exerciseSets.length + 1
      const newSet = await sessionService.addSet(
        activeSession.id,
        currentExercise.id,
        setNumber,
        reps,
        weight
      )

      addSet(newSet)
      setResting(true)
    } catch (error) {
      console.error('Failed to add set:', error)
    }
  }

  const handleFinishWorkout = async () => {
    if (!activeSession || !userId) return

    try {
      const totalVolume = activeSets.reduce((sum, set) => sum + set.reps * set.weight, 0)

      const startTime = new Date(activeSession.started_at).getTime()
      const endTime = new Date().getTime()
      const durationMinutes = (endTime - startTime) / 1000 / 60

      const caloriesBurned = Math.round(totalVolume * 0.05 + durationMinutes * 5)

      await sessionService.complete(activeSession.id, totalVolume, caloriesBurned)

      const today = formatDate(new Date())
      await statsService.updateDailyStats(userId, today)

      clearSession()
      navigate('/')
    } catch (error) {
      console.error('Failed to finish workout:', error)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div>
        <Header title="Loading..." />
      </div>
    )
  }

  if (!activeSession || !currentExercise) {
    return (
      <div>
        <Header title="Workout" />
        <div className="p-4">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No active workout session</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">{activeSession.workout_name}</h1>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </Header>

      <div className="p-4 space-y-4">
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>{currentExercise.name}</CardTitle>
            {currentExercise.muscle_group && (
              <p className="text-sm text-muted-foreground capitalize">
                {currentExercise.muscle_group}
              </p>
            )}
          </CardHeader>
        </Card>

        {resting ? (
          <RestTimer
            duration={90}
            onComplete={() => setResting(false)}
            onSkip={() => setResting(false)}
          />
        ) : (
          <ExerciseControls
            onComplete={handleCompleteSet}
            targetReps={10}
            targetWeight={20}
          />
        )}

        <SetHistory sets={exerciseSets} />

        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleFinishWorkout}
            disabled={activeSets.length === 0}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Finish
          </Button>
        </div>
      </div>
    </div>
  )
}
