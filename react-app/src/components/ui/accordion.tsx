import { type ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
  value: string
  trigger: ReactNode
  children: ReactNode
  open: boolean
  onToggle: () => void
}

function AccordionItem({ trigger, children, open, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left"
      >
        {trigger}
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden text-sm transition-all duration-200', open ? 'pb-4' : 'max-h-0')}>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </div>
  )
}

interface AccordionProps {
  type?: 'single' | 'multiple'
  items: { value: string; trigger: ReactNode; content: ReactNode }[]
  className?: string
}

export function Accordion({ type = 'single', items, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggle = (value: string) => {
    if (type === 'single') {
      setOpenItems(prev => prev.includes(value) ? [] : [value])
    } else {
      setOpenItems(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {items.map(item => (
        <AccordionItem
          key={item.value}
          value={item.value}
          trigger={item.trigger}
          open={openItems.includes(item.value)}
          onToggle={() => toggle(item.value)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}
