import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[72px] w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground',
        'placeholder:text-muted-foreground resize-none',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
