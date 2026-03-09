import { type HTMLAttributes, type ImgHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full', className)} {...props} />
  )
)
Avatar.displayName = 'Avatar'

export const AvatarImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img ref={ref} className={cn('aspect-square h-full w-full object-cover', className)} {...props} />
  )
)
AvatarImage.displayName = 'AvatarImage'

export const AvatarFallback = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground', className)} {...props} />
  )
)
AvatarFallback.displayName = 'AvatarFallback'
