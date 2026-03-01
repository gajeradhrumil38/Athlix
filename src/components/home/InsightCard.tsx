import { motion } from 'framer-motion'
import { TrendingUp, Award, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface InsightCardProps {
  insight: string
  type?: 'trend' | 'achievement' | 'goal'
}

export function InsightCard({ insight, type = 'trend' }: InsightCardProps) {
  const icons = {
    trend: TrendingUp,
    achievement: Award,
    goal: Target,
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Insight</h3>
              <p className="text-sm text-muted-foreground">{insight}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
