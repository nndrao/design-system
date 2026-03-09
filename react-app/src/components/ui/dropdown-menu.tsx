import { type ReactNode, useState, useRef, useEffect } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'end' | 'center'
  className?: string
}

export function DropdownMenu({ trigger, children, align = 'start', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(o => !o)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div className={cn(
          'absolute top-full mt-1 z-50 min-w-[160px] rounded-md border border-border bg-card shadow-lg py-1',
          align === 'end' && 'right-0',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          align === 'start' && 'left-0',
        )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownMenuTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('cursor-pointer', className)}>{children}</span>
}

export function DropdownMenuContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('min-w-[160px] rounded-md border border-border bg-card shadow-lg py-1', className)}>{children}</div>
}

export function DropdownMenuItem({ children, onClick, className, disabled }: { children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn('flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50', className)}
    >
      {children}
    </button>
  )
}

export function DropdownMenuCheckboxItem({ children, checked, onCheckedChange, className }: { children: ReactNode; checked?: boolean; onCheckedChange?: (v: boolean) => void; className?: string }) {
  return (
    <button
      onClick={() => onCheckedChange?.(!checked)}
      className={cn('flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent', className)}
    >
      <span className="w-4">{checked && <Check className="h-3 w-3" />}</span>
      {children}
    </button>
  )
}

export function DropdownMenuLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('px-3 py-1.5 text-xs font-semibold text-muted-foreground', className)}>{children}</p>
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-border', className)} />
}

export function DropdownMenuShortcut({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}>{children}</span>
}

export function DropdownMenuSub({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent">
        {trigger}
        <ChevronRight className="ml-auto h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-full top-0 min-w-[160px] rounded-md border border-border bg-card shadow-lg py-1">
          {children}
        </div>
      )}
    </div>
  )
}
