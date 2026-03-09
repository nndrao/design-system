import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn('flex flex-col gap-2', className)} data-value={value} data-onchange={onValueChange}>
      {children}
    </div>
  )
}

interface RadioGroupItemProps {
  value: string
  id?: string
  label?: ReactNode
  groupValue?: string
  onGroupChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function RadioGroupItem({ value, id, label, groupValue, onGroupChange, disabled, className }: RadioGroupItemProps) {
  const checked = groupValue === value

  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', disabled && 'cursor-not-allowed opacity-50', className)}>
      <button
        role="radio"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onGroupChange?.(value)}
        className={cn(
          'h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors',
          checked ? 'border-primary' : 'border-border hover:border-primary/60',
        )}
      >
        {checked && <div className="h-2 w-2 rounded-full bg-primary" />}
      </button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
}

interface RadioGroupWrapperProps {
  value: string
  onValueChange: (v: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
  className?: string
}

export function RadioGroupWrapper({ value, onValueChange, options, className }: RadioGroupWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {options.map(opt => (
        <label key={opt.value} className={cn('flex items-center gap-2 cursor-pointer', opt.disabled && 'opacity-50 cursor-not-allowed')}>
          <button
            role="radio"
            aria-checked={value === opt.value}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onValueChange(opt.value)}
            className={cn(
              'h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors',
              value === opt.value ? 'border-primary' : 'border-border hover:border-primary/60',
            )}
          >
            {value === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
          </button>
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
