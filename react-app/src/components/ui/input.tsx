import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-8 w-full rounded-lg border bg-card px-3 text-xs text-foreground',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error
          ? 'border-destructive focus:ring-destructive'
          : 'border-border',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
