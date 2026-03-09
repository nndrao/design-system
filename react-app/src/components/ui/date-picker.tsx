import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from './calendar'
import { Button } from './button'
import { Popover } from './popover'
import { PopoverContent } from './popover'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className, disabled }: DatePickerProps) {
  return (
    <Popover
      trigger={
        <Button
          variant="outline"
          disabled={disabled}
          className={cn('w-[200px] justify-start text-left font-normal gap-2', !value && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {value ? formatDate(value) : placeholder}
        </Button>
      }
    >
      <PopoverContent className="w-auto p-0">
        <Calendar selected={value} onSelect={(date) => onChange?.(date)} />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  from?: Date
  to?: Date
  onChange?: (range: { from?: Date; to?: Date }) => void
  className?: string
  disabled?: boolean
}

export function DateRangePicker({ from, to, onChange, className, disabled }: DateRangePickerProps) {
  const [selecting, setSelecting] = useState<'from' | 'to'>('from')

  const handleSelect = (date: Date) => {
    if (selecting === 'from') {
      onChange?.({ from: date, to: undefined })
      setSelecting('to')
    } else {
      if (from && date < from) {
        onChange?.({ from: date, to: from })
      } else {
        onChange?.({ from, to: date })
      }
      setSelecting('from')
    }
  }

  return (
    <Popover
      trigger={
        <Button
          variant="outline"
          disabled={disabled}
          className={cn('w-[260px] justify-start text-left font-normal gap-2', !from && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {from ? (
            to ? `${formatDate(from)} – ${formatDate(to)}` : `${formatDate(from)} – pick end`
          ) : 'Pick a date range'}
        </Button>
      }
    >
      <PopoverContent className="w-auto p-0">
        <div className="p-2 border-b border-border">
          <p className="text-xs text-muted-foreground text-center">
            {selecting === 'from' ? 'Select start date' : 'Select end date'}
          </p>
        </div>
        <Calendar selected={from} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
}
