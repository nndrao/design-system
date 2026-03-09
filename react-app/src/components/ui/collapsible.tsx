import { type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleProps {
  trigger: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Collapsible({ trigger, children, defaultOpen = false, className }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn('w-full', className)}>
      <div onClick={() => setOpen(o => !o)} className="cursor-pointer">
        {trigger}
      </div>
      <div className={cn('overflow-hidden transition-all duration-200', open ? 'opacity-100' : 'max-h-0 opacity-0')}>
        {children}
      </div>
    </div>
  )
}

export function CollapsibleTrigger({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return <div onClick={onClick} className={cn('cursor-pointer', className)}>{children}</div>
}

export function CollapsibleContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mt-2', className)}>{children}</div>
}
