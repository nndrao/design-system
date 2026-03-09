import { type ReactNode, useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  value: string
  label: ReactNode
  group?: string
  onSelect?: () => void
}

interface CommandProps {
  items: CommandItem[]
  placeholder?: string
  className?: string
}

export function Command({ items, placeholder = 'Type a command or search...', className }: CommandProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() =>
    query ? items.filter(i => String(i.label).toLowerCase().includes(query.toLowerCase()) || i.value.toLowerCase().includes(query.toLowerCase())) : items
  , [items, query])

  const groups = useMemo(() => {
    const map: Record<string, CommandItem[]> = {}
    filtered.forEach(item => {
      const g = item.group ?? ''
      ;(map[g] ??= []).push(item)
    })
    return map
  }, [filtered])

  return (
    <div className={cn('w-full rounded-lg border border-border bg-card shadow-md overflow-hidden', className)}>
      <div className="flex items-center gap-2 border-b border-border px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No results found.</p>
        ) : (
          Object.entries(groups).map(([group, groupItems]) => (
            <div key={group}>
              {group && <p className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{group}</p>}
              {groupItems.map(item => (
                <button
                  key={item.value}
                  onClick={item.onSelect}
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-default"
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function CommandInput({ placeholder, className, value, onChange }: { placeholder?: string; className?: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <div className={cn('flex items-center gap-2 border-b border-border px-3', className)}>
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
    </div>
  )
}
export function CommandEmpty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>
}
export function CommandGroup({ heading, children, className }: { heading?: string; children: ReactNode; className?: string }) {
  return <div className={cn('py-1', className)}>{heading && <p className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{heading}</p>}{children}</div>
}
export function CommandItem({ children, onSelect, className }: { children: ReactNode; onSelect?: () => void; className?: string }) {
  return <button onClick={onSelect} className={cn('flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent transition-colors cursor-default', className)}>{children}</button>
}
