import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/card'
import { Calendar as CalendarIcon } from 'lucide-react'

export function Calendar() {
  return (
    <div>
      <Header title="Calendar" />
      <div className="p-4">
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
          <p className="text-sm text-muted-foreground">
            Track your workout schedule and history on the calendar
          </p>
        </Card>
      </div>
    </div>
  )
}
