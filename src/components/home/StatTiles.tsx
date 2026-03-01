import { motion } from 'framer-motion'
import { Flame, Clock, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDuration } from '@/lib/utils'

interface StatTilesProps {
  caloriesToday: number
  timeThisWeek: number
  streak: number
}

export function StatTiles({ caloriesToday, timeThisWeek, streak }: StatTilesProps) {
  const stats = [
    {
      icon: Flame,
      label: 'Calories Today',
      value: caloriesToday,
      suffix: 'kcal',
      color: 'text-orange-500',
    },
    {
      icon: Clock,
      label: 'Time This Week',
      value: formatDuration(timeThisWeek),
      suffix: '',
      color: 'text-blue-500',
    },
    {
      icon: Zap,
      label: 'Day Streak',
      value: streak,
      suffix: 'days',
      color: 'text-primary',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <stat.icon className={`h-5 w-5 mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold mb-1">
                {typeof stat.value === 'number' ? stat.value : stat.value}
              </div>
              {stat.suffix && (
                <div className="text-xs text-muted-foreground mb-1">
                  {stat.suffix}
                </div>
              )}
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
