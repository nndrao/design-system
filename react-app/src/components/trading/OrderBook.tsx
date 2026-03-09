import { formatPrice } from '@/lib/utils'
import { ORDER_BOOK_BIDS, ORDER_BOOK_ASKS } from '@/lib/mock-data'

export function OrderBook() {
  const maxBidSize = Math.max(...ORDER_BOOK_BIDS.map(b => b.size))
  const maxAskSize = Math.max(...ORDER_BOOK_ASKS.map(a => a.size))

  return (
    <div className="bg-card h-full flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs font-medium">Order Book</span>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-3 py-1 text-[10px] text-muted-foreground border-b border-border shrink-0">
        <span>Size</span>
        <span className="text-center">Price</span>
        <span className="text-right">Size</span>
      </div>

      {/* Book Rows */}
      <div className="text-xs font-mono flex-1 overflow-auto">
        {ORDER_BOOK_BIDS.map((bid, i) => {
          const ask = ORDER_BOOK_ASKS[i]
          const bidPct = (bid.size / maxBidSize) * 100
          const askPct = ask ? (ask.size / maxAskSize) * 100 : 0

          return (
            <div key={i} className="grid grid-cols-3 px-3 py-0.5 items-center relative">
              {/* Bid bar (from right to left) */}
              <div className="relative">
                <div
                  className="absolute right-0 top-0 bottom-0 bg-buy/10"
                  style={{ width: `${bidPct}%` }}
                />
                <span className="relative text-muted-foreground">{bid.size.toLocaleString()}</span>
              </div>

              {/* Prices */}
              <div className="text-center flex justify-between px-1">
                <span className="text-buy">${formatPrice(bid.price)}</span>
                {ask && <span className="text-sell">${formatPrice(ask.price)}</span>}
              </div>

              {/* Ask bar (from left to right) */}
              <div className="relative text-right">
                {ask && (
                  <>
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-sell/10"
                      style={{ width: `${askPct}%` }}
                    />
                    <span className="relative text-muted-foreground">{ask.size.toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Spread */}
      <div className="px-3 py-1.5 border-t border-border flex justify-between text-[10px] text-muted-foreground shrink-0">
        <span>Spread: $0.02</span>
        <span>Mid: $263.89</span>
      </div>
    </div>
  )
}
