import { cn } from '@/lib/utils'
import { formatPrice, formatChange, formatPercent } from '@/lib/utils'

interface PriceDisplayProps {
  symbol: string
  price: number
  change: number
  changePct: number
  className?: string
}

export function PriceDisplay({ symbol, price, change, changePct, className }: PriceDisplayProps) {
  const isPositive = change > 0
  const isNeutral = change === 0

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="font-semibold">{symbol}</span>
      <span className="font-mono text-sm">${formatPrice(price)}</span>
      <span className={cn(
        'font-mono text-xs',
        isNeutral ? 'text-muted-foreground' : isPositive ? 'text-buy' : 'text-sell'
      )}>
        {isPositive ? '▲' : isNeutral ? '▲' : '▼'} ${formatChange(Math.abs(change))}
      </span>
      <span className={cn(
        'font-mono text-xs',
        isNeutral ? 'text-muted-foreground' : isPositive ? 'text-buy' : 'text-sell'
      )}>
        ({formatPercent(changePct)})
      </span>
    </div>
  )
}
