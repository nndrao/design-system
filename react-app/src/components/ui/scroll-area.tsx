import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollAreaProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function ScrollArea({ children, className, style }: ScrollAreaProps) {
  return (
    <div
      className={cn('overflow-auto', className)}
      style={style}
      data-scroll-area
    >
      {children}
    </div>
  )
}

export function ScrollBar({ orientation = 'vertical', className }: { orientation?: 'vertical' | 'horizontal'; className?: string }) {
  return (
    <div
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-px',
        className,
      )}
    />
  )
}
