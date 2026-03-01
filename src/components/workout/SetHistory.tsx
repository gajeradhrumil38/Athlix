import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { WorkoutSet } from '@/types'

interface SetHistoryProps {
  sets: WorkoutSet[]
}

export function SetHistory({ sets }: SetHistoryProps) {
  if (sets.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Completed Sets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sets.map((set, index) => (
          <div
            key={set.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Set {index + 1}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {set.reps} reps × {set.weight.toFixed(1)} kg
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
