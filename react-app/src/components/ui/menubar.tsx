import { type ReactNode, useState, useRef, useEffect } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenubarMenuProps {
  label: string
  children: ReactNode
}

interface MenubarProps {
  menus: MenubarMenuProps[]
  className?: string
}

export function Menubar({ menus, className }: MenubarProps) {
  const [open, setOpen] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={cn('flex items-center rounded-md border border-border bg-card px-1 h-9', className)}>
      {menus.map(menu => (
        <div key={menu.label} className="relative">
          <button
            onClick={() => setOpen(open === menu.label ? null : menu.label)}
            onMouseEnter={() => open && setOpen(menu.label)}
            className={cn(
              'flex items-center rounded-sm px-3 py-1.5 text-sm outline-none transition-colors',
              open === menu.label ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {menu.label}
          </button>
          {open === menu.label && (
            <div className="absolute top-full left-0 mt-1 z-50 min-w-[160px] rounded-md border border-border bg-card shadow-lg py-1"
              onClick={() => setOpen(null)}
            >
              {menu.children}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function MenubarMenu({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('relative', className)}>{children}</div>
}
export function MenubarTrigger({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <button onClick={onClick} className={cn('flex items-center rounded-sm px-3 py-1.5 text-sm hover:bg-accent transition-colors', className)}>{children}</button>
}
export function MenubarContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('min-w-[160px] rounded-md border border-border bg-card shadow-lg py-1', className)}>{children}</div>
}
export function MenubarItem({ children, onClick, className, disabled }: { children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className={cn('flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50', className)}>{children}</button>
}
export function MenubarSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-border', className)} />
}
export function MenubarShortcut({ children }: { children: ReactNode }) {
  return <span className="ml-auto text-xs text-muted-foreground">{children}</span>
}
export function MenubarCheckboxItem({ children, checked, onCheckedChange, className }: { children: ReactNode; checked?: boolean; onCheckedChange?: (v: boolean) => void; className?: string }) {
  return <button onClick={() => onCheckedChange?.(!checked)} className={cn('flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent', className)}><span className="w-4">{checked && <Check className="h-3 w-3" />}</span>{children}</button>
}
export function MenubarSub({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent">{trigger}<ChevronRight className="ml-auto h-4 w-4" /></button>
      {open && <div className="absolute left-full top-0 min-w-[160px] rounded-md border border-border bg-card shadow-lg py-1">{children}</div>}
    </div>
  )
}
