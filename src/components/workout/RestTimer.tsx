import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Timer } from 'lucide-react'

interface RestTimerProps {
  duration: number
  onComplete: () => void
  onSkip: () => void
}

export function RestTimer({ duration, onComplete, onSkip }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onComplete])

  const progress = ((duration - timeLeft) / duration) * 100

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <Timer className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Rest Time</h3>

          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="text-primary"
                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - progress / 100) }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold">{timeLeft}s</div>
            </div>
          </div>

          <Button variant="secondary" onClick={onSkip} className="w-full">
            Skip Rest
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
