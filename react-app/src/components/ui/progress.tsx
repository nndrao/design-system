import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  variant?: 'default' | 'buy' | 'sell' | 'warning'
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, variant = 'default', ...props }, ref) => {
    const barColor = {
      default: 'bg-primary',
      buy:     'bg-buy',
      sell:    'bg-sell',
      warning: 'bg-warning',
    }[variant]

    return (
      <div ref={ref} className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-muted', className)} {...props}>
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = 'Progress'
