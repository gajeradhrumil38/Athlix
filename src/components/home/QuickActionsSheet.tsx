import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Dumbbell, Target, Plus, Play } from 'lucide-react'

interface QuickActionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuickWorkout: () => void
  onStartTemplate: () => void
  onCreateTemplate: () => void
}

export function QuickActionsSheet({
  open,
  onOpenChange,
  onQuickWorkout,
  onStartTemplate,
  onCreateTemplate,
}: QuickActionsSheetProps) {
  const actions = [
    {
      icon: Play,
      label: 'Quick Workout',
      description: 'Start a freestyle workout',
      onClick: () => {
        onQuickWorkout()
        onOpenChange(false)
      },
    },
    {
      icon: Target,
      label: 'Start Template',
      description: 'Begin a planned workout',
      onClick: () => {
        onStartTemplate()
        onOpenChange(false)
      },
    },
    {
      icon: Plus,
      label: 'New Template',
      description: 'Create a workout template',
      onClick: () => {
        onCreateTemplate()
        onOpenChange(false)
      },
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 top-auto translate-y-0 rounded-t-2xl rounded-b-none border-t">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Quick Actions
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 pb-4">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="w-full justify-start h-auto py-4"
              onClick={action.onClick}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{action.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
