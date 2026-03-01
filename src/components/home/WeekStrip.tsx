import { motion } from 'framer-motion'
import { cn, getWeekDates, getDayOfWeek, isToday } from '@/lib/utils'
import { DailyStats } from '@/types'

interface WeekStripProps {
  weekStats: DailyStats[]
}

export function WeekStrip({ weekStats }: WeekStripProps) {
  const weekDates = getWeekDates()

  const getStatsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return weekStats.find((s) => s.date === dateStr)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {weekDates.map((date, index) => {
        const stats = getStatsForDate(date)
        const hasWorkout = stats && stats.sessions_count > 0
        const isTodayDate = isToday(date)

        return (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'flex flex-col items-center justify-center min-w-[48px] h-16 rounded-lg border transition-colors',
              isTodayDate && 'border-primary bg-primary/10',
              !isTodayDate && hasWorkout && 'border-primary/50 bg-primary/5',
              !isTodayDate && !hasWorkout && 'border-border bg-card'
            )}
          >
            <span className={cn(
              'text-xs font-medium',
              isTodayDate ? 'text-primary' : 'text-muted-foreground'
            )}>
              {getDayOfWeek(date)}
            </span>
            <span className={cn(
              'text-lg font-bold',
              isTodayDate && 'text-primary',
              hasWorkout && !isTodayDate && 'text-foreground',
              !hasWorkout && !isTodayDate && 'text-muted-foreground'
            )}>
              {date.getDate()}
            </span>
            {hasWorkout && (
              <div className={cn(
                'w-1 h-1 rounded-full mt-1',
                isTodayDate ? 'bg-primary' : 'bg-primary/50'
              )} />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
