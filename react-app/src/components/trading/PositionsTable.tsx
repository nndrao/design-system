import { cn, formatPrice } from '@/lib/utils'
import { POSITIONS_DATA } from '@/lib/mock-data'
import { X } from 'lucide-react'

export function PositionsTable() {
  return (
    <div className="bg-card h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs font-medium">Positions</span>
        <span className="text-[10px] text-muted-foreground">{POSITIONS_DATA.length} open</span>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-xs">
          <thead className="bg-elevated">
            <tr>
              <th className="px-3 py-1.5 text-left text-[11px] font-medium text-muted-foreground">Symbol</th>
              <th className="px-3 py-1.5 text-left text-[11px] font-medium text-muted-foreground">Side</th>
              <th className="px-3 py-1.5 text-right text-[11px] font-medium text-muted-foreground">Qty</th>
              <th className="px-3 py-1.5 text-right text-[11px] font-medium text-muted-foreground">Entry</th>
              <th className="px-3 py-1.5 text-right text-[11px] font-medium text-muted-foreground">Current</th>
              <th className="px-3 py-1.5 text-right text-[11px] font-medium text-muted-foreground">P&L</th>
              <th className="px-3 py-1.5 text-center text-[11px] font-medium text-muted-foreground w-10"></th>
            </tr>
          </thead>
          <tbody>
            {POSITIONS_DATA.map(pos => (
              <tr key={`${pos.symbol}-${pos.side}`} className="border-b border-border/50 hover:bg-elevated transition-colors">
                <td className="px-3 py-1.5 font-medium">{pos.symbol}</td>
                <td className="px-3 py-1.5">
                  <span className={cn(
                    'inline-block px-1.5 py-0.5 rounded text-[10px] font-medium',
                    pos.side === 'BUY'
                      ? 'bg-buy-muted text-buy'
                      : 'bg-sell-muted text-sell'
                  )}>
                    {pos.side}
                  </span>
                </td>
                <td className="px-3 py-1.5 font-mono text-right">{pos.qty}</td>
                <td className="px-3 py-1.5 font-mono text-right">${formatPrice(pos.entry)}</td>
                <td className="px-3 py-1.5 font-mono text-right">${formatPrice(pos.current)}</td>
                <td className={cn(
                  'px-3 py-1.5 font-mono text-right font-medium',
                  pos.pnl >= 0 ? 'text-buy' : 'text-sell'
                )}>
                  {pos.pnl >= 0 ? '+' : ''}${formatPrice(pos.pnl)}
                </td>
                <td className="px-3 py-1.5 text-center">
                  <button className="p-0.5 rounded hover:bg-sell-muted text-muted-foreground hover:text-sell transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
