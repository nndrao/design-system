import { useState } from 'react'
import { cn } from '@/lib/utils'

type Side = 'buy' | 'sell'
type OrderType = 'market' | 'limit' | 'stop'

export function OrderEntry() {
  const [side, setSide] = useState<Side>('buy')
  const [orderType, setOrderType] = useState<OrderType>('limit')
  const [quantity, setQuantity] = useState(1)
  const [limitPrice, setLimitPrice] = useState('263.93')
  const [showConfirm, setShowConfirm] = useState(false)

  const isBuy = side === 'buy'

  return (
    <>
      <div className="bg-card h-full overflow-auto p-3 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">AAPL</span>
          <span className="text-xs font-mono text-muted-foreground">$263.90</span>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="flex rounded-md overflow-hidden border border-border">
          <button
            onClick={() => setSide('buy')}
            className={cn(
              'flex-1 py-1.5 text-xs font-medium transition-colors',
              isBuy ? 'bg-buy text-buy-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setSide('sell')}
            className={cn(
              'flex-1 py-1.5 text-xs font-medium transition-colors',
              !isBuy ? 'bg-sell text-sell-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            )}
          >
            Sell
          </button>
        </div>

        {/* Order Type */}
        <div>
          <label className="text-[11px] text-muted-foreground mb-1 block">Order type</label>
          <select
            value={orderType}
            onChange={e => setOrderType(e.target.value as OrderType)}
            className="w-full bg-secondary border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-[11px] text-muted-foreground mb-1 block">Quantity</label>
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1.5 bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 bg-transparent text-center text-xs font-mono py-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-2 py-1.5 bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Limit Price (shown for limit and stop orders) */}
        {orderType !== 'market' && (
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">
              {orderType === 'limit' ? 'Limit price' : 'Stop price'}
            </label>
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <span className="px-2 text-xs text-muted-foreground">$</span>
              <input
                type="text"
                value={limitPrice}
                onChange={e => setLimitPrice(e.target.value)}
                className="flex-1 bg-transparent text-xs font-mono py-1.5 focus:outline-none"
              />
              <div className="flex flex-col border-l border-border">
                <button
                  onClick={() => setLimitPrice((parseFloat(limitPrice) + 0.01).toFixed(2))}
                  className="px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  +
                </button>
                <button
                  onClick={() => setLimitPrice((parseFloat(limitPrice) - 0.01).toFixed(2))}
                  className="px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-t border-border"
                >
                  −
                </button>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              Bid $263.82 &middot; Ask $263.93
            </div>
          </div>
        )}

        {/* Time in Force */}
        <div>
          <label className="text-[11px] text-muted-foreground mb-1 block">Time in force</label>
          <select className="w-full bg-secondary border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
            <option>Good for day</option>
            <option>Good til canceled</option>
          </select>
        </div>

        {/* Estimated Cost */}
        <div className="border-t border-border pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-sell font-medium">Estimated cost</span>
            <span className="font-mono font-medium">
              ${(quantity * parseFloat(limitPrice || '0')).toFixed(2)}
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground">Buying power $0.00</div>
        </div>

        {/* Submit */}
        <button
          onClick={() => setShowConfirm(true)}
          className={cn(
            'w-full py-2 rounded-md text-xs font-medium transition-colors',
            isBuy
              ? 'bg-buy text-buy-foreground hover:bg-buy/90'
              : 'bg-sell text-sell-foreground hover:bg-sell/90'
          )}
        >
          {isBuy ? 'Buy' : 'Sell'} AAPL
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card border border-border rounded-lg p-4 w-80 shadow-lg">
            <h3 className="text-sm font-semibold mb-3">Confirm Order</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symbol</span>
                <span className="font-medium">AAPL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Side</span>
                <span className={cn('font-medium', isBuy ? 'text-buy' : 'text-sell')}>
                  {side.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-mono">{quantity}</span>
              </div>
              {orderType !== 'market' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-mono">${limitPrice}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-1.5 text-xs rounded-md border border-border bg-secondary hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className={cn(
                  'flex-1 py-1.5 text-xs rounded-md font-medium transition-colors',
                  isBuy
                    ? 'bg-buy text-buy-foreground hover:bg-buy/90'
                    : 'bg-sell text-sell-foreground hover:bg-sell/90'
                )}
              >
                {isBuy ? 'Buy' : 'Sell'} AAPL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
