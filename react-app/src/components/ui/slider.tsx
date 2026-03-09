import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  className?: string
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ value = 50, min = 0, max = 100, step = 1, onChange, className, disabled, ...props }, ref) => {
    const pct = ((value - min) / (max - min)) * 100

    return (
      <div className={cn('relative flex w-full touch-none items-center', className)}>
        <div className="relative h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="absolute h-full bg-primary rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={e => onChange?.(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
        <div
          className={cn(
            'absolute h-4 w-4 rounded-full border-2 border-primary bg-card shadow transition-all',
            disabled && 'cursor-not-allowed opacity-50',
          )}
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'
