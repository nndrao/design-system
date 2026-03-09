import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        outline: 'border border-border bg-transparent hover:bg-accent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-2.5',
        md: 'h-9 px-3',
        lg: 'h-10 px-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

interface ToggleProps extends VariantProps<typeof toggleVariants> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function Toggle({ pressed, onPressedChange, children, disabled, variant, size, className }: ToggleProps) {
  return (
    <button
      data-state={pressed ? 'on' : 'off'}
      disabled={disabled}
      onClick={() => onPressedChange?.(!pressed)}
      aria-pressed={pressed}
      className={cn(toggleVariants({ variant, size }), className)}
    >
      {children}
    </button>
  )
}
