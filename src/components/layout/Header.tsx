import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  children?: ReactNode
  className?: string
}

export function Header({ title, children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="flex h-14 items-center px-4 safe-top">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        {children}
      </div>
    </header>
  )
}
