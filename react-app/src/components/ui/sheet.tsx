import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export function Sheet({ open, onOpenChange, children, side = 'right', className }: SheetProps) {
  if (!open) return null

  const sideClasses = {
    right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l',
    left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
    top: 'inset-x-0 top-0 w-full border-b',
    bottom: 'inset-x-0 bottom-0 w-full border-t',
  }

  const enterClasses = {
    right: 'animate-in slide-in-from-right',
    left: 'animate-in slide-in-from-left',
    top: 'animate-in slide-in-from-top',
    bottom: 'animate-in slide-in-from-bottom',
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className={cn('absolute bg-card shadow-xl flex flex-col', sideClasses[side], enterClasses[side], className)}>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5 p-6 pr-10', className)}>{children}</div>
}
export function SheetTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-base font-semibold', className)}>{children}</h2>
}
export function SheetDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}
export function SheetContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex-1 overflow-auto p-6', className)}>{children}</div>
}
export function SheetFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex justify-end gap-2 p-6 pt-0', className)}>{children}</div>
}
