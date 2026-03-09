import { type InputHTMLAttributes, forwardRef, useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, checked, defaultChecked, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(checked ?? defaultChecked ?? false)

    useEffect(() => {
      if (checked !== undefined) setIsChecked(checked as boolean)
    }, [checked])

    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          ref={ref}
          type="checkbox"
          checked={isChecked}
          onChange={e => { setIsChecked(e.target.checked); onChange?.(e) }}
          className="sr-only peer"
          {...props}
        />
        <div className={cn(
          'h-4 w-4 rounded border transition-colors flex items-center justify-center',
          isChecked ? 'bg-primary border-primary' : 'bg-card border-border',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          className
        )}>
          {isChecked && <Check className="size-2.5 text-primary-foreground" />}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'
