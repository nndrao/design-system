import { type VariantProps, cva } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:   'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:     'border border-border bg-transparent text-foreground hover:bg-accent',
        ghost:       'bg-transparent text-foreground hover:bg-accent',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        buy:         'bg-buy text-buy-foreground hover:bg-buy/90',
        sell:        'bg-sell text-sell-foreground hover:bg-sell/90',
        link:        'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        xs: 'h-6 rounded px-2 text-[11px]',
        sm: 'h-7 rounded-md px-3 text-xs',
        md: 'h-8 rounded-lg px-4 text-xs',
        lg: 'h-10 rounded-xl px-6 text-sm',
        xl: 'h-12 rounded-full px-8 text-sm',
        icon: 'h-7 w-7 rounded-md',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
)
Button.displayName = 'Button'

export { buttonVariants }
