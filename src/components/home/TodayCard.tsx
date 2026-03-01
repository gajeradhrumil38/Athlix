import { motion } from 'framer-motion'
import { Play, CheckCircle2, Dumbbell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SessionState } from '@/types'
import { cn } from '@/lib/utils'

interface TodayCardProps {
  state: SessionState
  workoutName?: string
  onStart: () => void
  onResume: () => void
}

export function TodayCard({ state, workoutName, onStart, onResume }: TodayCardProps) {
  const getContent = () => {
    switch (state) {
      case 'ACTIVE':
        return {
          icon: <Play className="h-8 w-8 fill-primary text-primary" />,
          title: 'Workout in Progress',
          subtitle: workoutName || 'Active Session',
          action: 'Resume Workout',
          onClick: onResume,
          gradient: 'from-primary/20 to-accent/10',
        }
      case 'COMPLETED':
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
          title: 'Great Work!',
          subtitle: 'Today\'s workout completed',
          action: 'View Summary',
          onClick: () => {},
          gradient: 'from-primary/10 to-secondary/10',
        }
      case 'PLANNED':
        return {
          icon: <Dumbbell className="h-8 w-8 text-primary" />,
          title: workoutName || 'Workout Ready',
          subtitle: 'Start your planned workout',
          action: 'Start Workout',
          onClick: onStart,
          gradient: 'from-primary/20 to-accent/10',
        }
      default:
        return {
          icon: <Dumbbell className="h-8 w-8 text-muted-foreground" />,
          title: 'Ready to Train?',
          subtitle: 'Choose a workout to get started',
          action: 'Quick Workout',
          onClick: onStart,
          gradient: 'from-secondary/50 to-muted/30',
        }
    }
  }

  const content = getContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('border-2 border-border bg-gradient-to-br', content.gradient)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="mt-1">{content.icon}</div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{content.title}</h2>
                <p className="text-sm text-muted-foreground">{content.subtitle}</p>
              </div>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={content.onClick}
          >
            {content.action}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
