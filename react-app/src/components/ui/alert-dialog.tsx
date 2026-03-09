import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
  children?: ReactNode
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
}: AlertDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>{cancelLabel}</Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'default'} size="sm" onClick={() => { onConfirm(); onOpenChange(false) }}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AlertDialogTrigger({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return <span className={cn('cursor-pointer', className)} onClick={onClick}>{children}</span>
}
