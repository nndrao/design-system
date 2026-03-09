import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <div className={cn('group relative inline-flex', className)}>
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="rounded-md bg-foreground px-2 py-1 text-[11px] text-background whitespace-nowrap shadow-lg">
          {content}
        </div>
        <div className="mx-auto mt-0.5 h-1.5 w-1.5 rotate-45 bg-foreground" />
      </div>
    </div>
  )
}

export const TooltipContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-md bg-foreground px-2 py-1 text-[11px] text-background', className)} {...props} />
  )
)
TooltipContent.displayName = 'TooltipContent'
