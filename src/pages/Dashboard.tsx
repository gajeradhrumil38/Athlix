import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export function Dashboard() {
  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-4">
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            View detailed charts and insights about your progress
          </p>
        </Card>
      </div>
    </div>
  )
}
