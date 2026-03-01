import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TodayCard } from '@/components/home/TodayCard'
import { WeekStrip } from '@/components/home/WeekStrip'
import { StatTiles } from '@/components/home/StatTiles'
import { InsightCard } from '@/components/home/InsightCard'
import { QuickActionsSheet } from '@/components/home/QuickActionsSheet'
import { useStore } from '@/store'
import { sessionService } from '@/lib/services/sessionService'
import { statsService } from '@/lib/services/statsService'
import { templateService } from '@/lib/services/templateService'
import { SessionState } from '@/types'
import { supabase } from '@/lib/supabase'

export function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [sessionState, setSessionState] = useState<SessionState>('EMPTY')
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)

  const {
    todayStats,
    weeklyStats,
    todayWorkout,
    setActiveSession,
    setTodayStats,
    setWeeklyStats,
    setActiveTemplate,
    setTodayWorkout,
  } = useStore()

  useEffect(() => {
    const initializeHome = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setSessionState('EMPTY')
          setLoading(false)
          return
        }

        const [activeSessionData, todaySessionData, todayStatsData, weeklyStatsData, activeTemplateData] =
          await Promise.all([
            sessionService.getActiveSession(user.id),
            sessionService.getTodaySession(user.id),
            statsService.getTodayStats(user.id),
            statsService.getWeeklyStats(user.id),
            templateService.getActive(user.id),
          ])

        setActiveSession(activeSessionData)
        setTodayStats(todayStatsData)
        setWeeklyStats(weeklyStatsData)
        setActiveTemplate(activeTemplateData)

        if (activeSessionData) {
          setSessionState('ACTIVE')
        } else if (todaySessionData?.status === 'completed') {
          setSessionState('COMPLETED')
        } else if (activeTemplateData) {
          const workout = await templateService.resolveTodayWorkout(activeTemplateData)
          setTodayWorkout(workout)
          setSessionState(workout ? 'PLANNED' : 'EMPTY')
        } else {
          setSessionState('EMPTY')
        }
      } catch (error) {
        console.error('Failed to initialize home:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeHome()
  }, [])

  const handleStartWorkout = () => {
    navigate('/workout')
  }

  const handleResumeWorkout = () => {
    navigate('/workout')
  }

  const getContextMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getInsight = () => {
    if (!weeklyStats) return 'Start your fitness journey today!'

    if (weeklyStats.streak >= 7) {
      return `Amazing! You've maintained a ${weeklyStats.streak} day streak. Keep it up!`
    }
    if (weeklyStats.totalSessions >= 5) {
      return 'You\'re crushing it this week with consistent training!'
    }
    if (weeklyStats.streak === 0) {
      return 'Every journey starts with a single step. Start your workout today!'
    }
    return 'Stay consistent to build lasting habits and see results!'
  }

  if (loading) {
    return (
      <div>
        <Header>
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-6 w-32" />
          </div>
        </Header>
        <div className="p-4 space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">{getContextMessage()}</h1>
        </div>
      </Header>

      <div className="p-4 space-y-4">
        <TodayCard
          state={sessionState}
          workoutName={todayWorkout?.workout_name}
          onStart={handleStartWorkout}
          onResume={handleResumeWorkout}
        />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">This Week</h3>
          <WeekStrip weekStats={weeklyStats?.dayStats || []} />
        </div>

        <StatTiles
          caloriesToday={todayStats?.calories_burned || 0}
          timeThisWeek={weeklyStats?.totalDuration || 0}
          streak={weeklyStats?.streak || 0}
        />

        <InsightCard insight={getInsight()} type="trend" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="fixed bottom-20 right-4 z-40"
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => setQuickActionsOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      <QuickActionsSheet
        open={quickActionsOpen}
        onOpenChange={setQuickActionsOpen}
        onQuickWorkout={handleStartWorkout}
        onStartTemplate={handleStartWorkout}
        onCreateTemplate={() => navigate('/library')}
      />
    </div>
  )
}
