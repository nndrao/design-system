import { cn } from '@/lib/utils'

export function Sidebar() {
  return (
    <aside className="w-48 border-r border-border bg-card flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="text-xs text-muted-foreground mb-1">Individual</div>
        <div className="text-lg font-semibold font-mono">$0.00</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-buy">▲ $0.00</span>
          <span className="text-xs text-muted-foreground">— Today</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-buy">▲ $0.00</span>
          <span className="text-xs text-muted-foreground">— Overnight</span>
        </div>
      </div>
      <div className="p-3 border-b border-border">
        <div className="text-xs text-muted-foreground">Overview</div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">Buying power</span>
          <span className="text-xs font-mono">$0.00</span>
        </div>
      </div>
      <div className="p-3 flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Watchlist</span>
          <button className={cn(
            "text-xs px-2 py-0.5 rounded bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors"
          )}>
            Deposit
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Select a symbol from the watchlist to view details
        </p>
      </div>
    </aside>
  )
}
