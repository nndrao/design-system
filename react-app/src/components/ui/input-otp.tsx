import { useRef, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface InputOTPProps {
  length?: number
  value: string
  onChange: (value: string) => void
  className?: string
}

export function InputOTP({ length = 6, value, onChange, className }: InputOTPProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[i] && i > 0) {
        inputs.current[i - 1]?.focus()
        onChange(value.slice(0, i - 1) + value.slice(i))
      } else {
        onChange(value.slice(0, i) + value.slice(i + 1))
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      inputs.current[i + 1]?.focus()
    }
  }

  const handleChange = (i: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1)
    if (!digit) return
    const next = value.slice(0, i) + digit + value.slice(i + 1)
    onChange(next)
    if (i < length - 1) inputs.current[i + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(value.length > pasted.length ? value.length : 0, '').slice(0, length))
    inputs.current[Math.min(pasted.length, length - 1)]?.focus()
    e.preventDefault()
  }

  return (
    <div className={cn('flex gap-2', className)}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          className="h-10 w-10 rounded-md border border-border bg-card text-center text-sm font-medium shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-colors caret-transparent"
        />
      ))}
    </div>
  )
}

export function InputOTPGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex gap-2', className)}>{children}</div>
}

export function InputOTPSlot({ index, value, className }: { index: number; value?: string; className?: string }) {
  return (
    <div className={cn('relative flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-sm font-medium', className)}>
      {value?.[index] ?? ''}
      {!value?.[index] && <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground">-</span>}
    </div>
  )
}
