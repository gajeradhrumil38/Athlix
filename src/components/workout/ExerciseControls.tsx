import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ExerciseControlsProps {
  onComplete: (reps: number, weight: number) => void
  targetReps?: number
  targetWeight?: number
}

export function ExerciseControls({
  onComplete,
  targetReps = 10,
  targetWeight = 20,
}: ExerciseControlsProps) {
  const [reps, setReps] = useState(targetReps)
  const [weight, setWeight] = useState(targetWeight)

  const adjustValue = (
    current: number,
    adjustment: number,
    setter: (value: number) => void,
    min = 0
  ) => {
    const newValue = Math.max(min, current + adjustment)
    setter(newValue)
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-3 block">
            Reps
          </label>
          <div className="flex items-center justify-between gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 w-14 rounded-full"
              onClick={() => adjustValue(reps, -1, setReps)}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <div className="flex-1 text-center">
              <div className="text-5xl font-bold">{reps}</div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 w-14 rounded-full"
              onClick={() => adjustValue(reps, 1, setReps)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-3 block">
            Weight (kg)
          </label>
          <div className="flex items-center justify-between gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 w-14 rounded-full"
              onClick={() => adjustValue(weight, -2.5, setWeight)}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <div className="flex-1 text-center">
              <div className="text-5xl font-bold">{weight.toFixed(1)}</div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 w-14 rounded-full"
              onClick={() => adjustValue(weight, 2.5, setWeight)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={() => onComplete(reps, weight)}
        >
          Complete Set
        </Button>
      </CardContent>
    </Card>
  )
}
