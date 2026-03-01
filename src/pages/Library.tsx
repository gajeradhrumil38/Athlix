import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/card'
import { Library as LibraryIcon } from 'lucide-react'

export function Library() {
  return (
    <div>
      <Header title="Library" />
      <div className="p-4">
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <LibraryIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Exercise Library</h3>
          <p className="text-sm text-muted-foreground">
            Browse and manage your exercise library and templates
          </p>
        </Card>
      </div>
    </div>
  )
}
