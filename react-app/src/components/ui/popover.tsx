import { type ReactNode, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
  className?: string
}

export function Popover({ trigger, children, align = 'start', side = 'bottom', className }: PopoverProps) {
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
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(o => !o)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div className={cn(
          'absolute z-50 rounded-md border border-border bg-card shadow-lg',
          side === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1',
          align === 'start' && 'left-0',
          align === 'end' && 'right-0',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          className,
        )}>
          {children}
        </div>
      )}
    </div>
  )
}

export function PopoverTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('cursor-pointer', className)}>{children}</span>
}

export function PopoverContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('w-72 p-4 text-sm', className)}>{children}</div>
}
