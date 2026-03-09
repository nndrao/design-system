import { createContext, useContext, type HTMLAttributes, type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type TabsCtx = { value: string; onChange: (v: string) => void }
const TabsContext = createContext<TabsCtx>({ value: '', onChange: () => {} })

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (v: string) => void
}
export function Tabs({ value, onValueChange, className, ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={cn('flex flex-col', className)} {...props} />
    </TabsContext.Provider>
  )
}

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('inline-flex items-center border-b border-border', className)}
      {...props}
    />
  )
)
TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = useContext(TabsContext)
    const active = ctx.value === value
    return (
      <button
        ref={ref}
        onClick={() => ctx.onChange(value)}
        className={cn(
          'px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
          active
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = useContext(TabsContext)
    if (ctx.value !== value) return null
    return <div ref={ref} className={cn('mt-4', className)} {...props} />
  }
)
TabsContent.displayName = 'TabsContent'
