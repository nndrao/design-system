import { useState } from 'react'
import { cn, formatPrice, formatChange, formatPercent, formatVolume } from '@/lib/utils'
import { WATCHLIST_DATA, type WatchlistItem } from '@/lib/mock-data'
import { ArrowUpDown } from 'lucide-react'

type SortKey = keyof WatchlistItem
type SortDir = 'asc' | 'desc'

export function Watchlist() {
  const [sortKey, setSortKey] = useState<SortKey>('symbol')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>('AAPL')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...WATCHLIST_DATA].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    const mult = sortDir === 'asc' ? 1 : -1
    if (typeof aVal === 'string') return mult * aVal.localeCompare(bVal as string)
    return mult * ((aVal as number) - (bVal as number))
  })

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-3 py-1.5 text-left text-[11px] font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === field && (
          <ArrowUpDown className="w-3 h-3" />
        )}
      </span>
    </th>
  )

  return (
    <div className="bg-card h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs font-medium">First list</span>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-xs">
          <thead className="bg-elevated sticky top-0">
            <tr>
              <th className="w-8 px-2 py-1.5 text-left text-[11px] font-medium text-muted-foreground">#</th>
              <SortHeader label="Symbol" field="symbol" />
              <SortHeader label="Net chg" field="change" />
              <SortHeader label="Chg %" field="changePct" />
              <SortHeader label="Last" field="last" />
              <SortHeader label="Volume" field="volume" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => {
              const isPositive = item.change > 0
              const isNeutral = item.change === 0
              const colorClass = isNeutral ? 'text-muted-foreground' : isPositive ? 'text-buy' : 'text-sell'

              return (
                <tr
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={cn(
                    'cursor-pointer transition-colors border-b border-border/50',
                    selectedSymbol === item.symbol
                      ? 'bg-sell-muted'
                      : 'hover:bg-elevated'
                  )}
                >
                  <td className="px-2 py-1.5 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{item.symbol}</td>
                  <td className={cn('px-3 py-1.5 font-mono', colorClass)}>
                    {isPositive ? '▲' : isNeutral ? '▲' : '▼'} ${formatChange(Math.abs(item.change))}
                  </td>
                  <td className={cn('px-3 py-1.5 font-mono', colorClass)}>
                    {isPositive ? '▲' : isNeutral ? '▲' : '▼'} {formatPercent(Math.abs(item.changePct))}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-right">${formatPrice(item.last)}</td>
                  <td className="px-3 py-1.5 font-mono text-right text-muted-foreground">{formatVolume(item.volume)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
