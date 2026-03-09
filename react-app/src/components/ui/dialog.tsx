import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function Dialog({ open, onClose, onOpenChange, children }: DialogProps) {
  if (!open) return null
  const close = () => { onClose?.(); onOpenChange?.(false) }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export const DialogContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl', className)}
      {...props}
    />
  )
)
DialogContent.displayName = 'DialogContent'

interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}
export function DialogHeader({ className, onClose, children, ...props }: DialogHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)} {...props}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="ml-2 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

export const DialogTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm font-semibold text-foreground', className)} {...props} />
  )
)
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-xs text-muted-foreground mt-1', className)} {...props} />
  )
)
DialogDescription.displayName = 'DialogDescription'

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-end gap-2 mt-4', className)} {...props} />
  )
)
DialogFooter.displayName = 'DialogFooter'
