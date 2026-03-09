import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface KbdProps {
  children: ReactNode
  className?: string
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd className={cn(
      'inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground shadow-sm',
      className,
    )}>
      {children}
    </kbd>
  )
}
