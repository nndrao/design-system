import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const today = new Date()
  const [view, setView] = useState(selected ?? today)

  const year = view.getFullYear()
  const month = view.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isSame = (d: number) =>
    selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d

  const isToday = (d: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d

  const prev = () => setView(new Date(year, month - 1, 1))
  const next = () => setView(new Date(year, month + 1, 1))

  return (
    <div className={cn('p-3 rounded-lg border border-border bg-card w-[280px]', className)}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="p-1 rounded hover:bg-accent transition-colors">
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-medium">{MONTHS[month]} {year}</span>
        <button onClick={next} className="p-1 rounded hover:bg-accent transition-colors">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button
                onClick={() => onSelect?.(new Date(year, month, day))}
                className={cn(
                  'h-8 w-8 rounded-md text-sm transition-colors',
                  isSame(day) && 'bg-primary text-primary-foreground font-medium',
                  isToday(day) && !isSame(day) && 'border border-border font-medium',
                  !isSame(day) && 'hover:bg-accent text-foreground',
                )}
              >
                {day}
              </button>
            ) : <div className="h-8 w-8" />}
          </div>
        ))}
      </div>
    </div>
  )
}
