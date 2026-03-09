import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HoverCardProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
  className?: string
}

export function HoverCard({ trigger, children, align = 'center', side = 'bottom', className }: HoverCardProps) {
  return (
    <div className="group relative inline-block">
      {trigger}
      <div className={cn(
        'pointer-events-none absolute z-50 w-64 rounded-md border border-border bg-card p-4 shadow-lg',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
        side === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1',
        align === 'start' && 'left-0',
        align === 'end' && 'right-0',
        align === 'center' && 'left-1/2 -translate-x-1/2',
        className,
      )}>
        {children}
      </div>
    </div>
  )
}

export function HoverCardTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('cursor-pointer', className)}>{children}</span>
}

export function HoverCardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('text-sm', className)}>{children}</div>
}
