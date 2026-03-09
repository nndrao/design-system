import { type ReactNode, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

type ToggleGroupType = 'single' | 'multiple'

interface ToggleGroupContextValue {
  value: string | string[]
  onValueChange: (value: string) => void
  type: ToggleGroupType
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  value: '',
  onValueChange: () => {},
  type: 'single',
})

interface ToggleGroupProps {
  type?: ToggleGroupType
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: ReactNode
  className?: string
}

export function ToggleGroup({ type = 'single', value = '', onValueChange, children, className }: ToggleGroupProps) {
  const handleChange = (v: string) => {
    if (type === 'single') {
      onValueChange?.(v)
    } else {
      const arr = Array.isArray(value) ? value : []
      const next = arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v]
      onValueChange?.(next as unknown as string)
    }
  }

  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange: handleChange, type }}>
      <div className={cn('inline-flex items-center rounded-md border border-border bg-card p-1 gap-0.5', className)}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
}

interface ToggleGroupItemProps {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function ToggleGroupItem({ value, children, disabled, className }: ToggleGroupItemProps) {
  const ctx = useContext(ToggleGroupContext)
  const pressed = Array.isArray(ctx.value) ? ctx.value.includes(value) : ctx.value === value

  return (
    <button
      data-state={pressed ? 'on' : 'off'}
      disabled={disabled}
      onClick={() => !disabled && ctx.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center rounded px-3 h-8 text-sm font-medium transition-colors',
        'hover:bg-accent disabled:pointer-events-none disabled:opacity-50',
        pressed ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  )
}
