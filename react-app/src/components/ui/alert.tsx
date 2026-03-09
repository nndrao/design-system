import { type VariantProps, cva } from 'class-variance-authority'
import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-xl border p-3 text-xs [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-3 [&>svg+div]:pl-6',
  {
    variants: {
      variant: {
        default:     'bg-card border-border text-foreground',
        info:        'bg-primary/10 border-primary/20 text-foreground [&>svg]:text-primary',
        success:     'bg-buy-muted border-buy/20 text-foreground [&>svg]:text-buy',
        warning:     'bg-warning/10 border-warning/20 text-foreground [&>svg]:text-warning',
        destructive: 'bg-sell-muted border-sell/20 text-foreground [&>svg]:text-sell',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export const Alert = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(alertVariants({ variant }), className)} role="alert" {...props} />
  )
)
Alert.displayName = 'Alert'

export const AlertTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-0.5 font-semibold leading-none', className)} {...props} />
  )
)
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-[11px] text-muted-foreground', className)} {...props} />
  )
)
AlertDescription.displayName = 'AlertDescription'
