import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { BASE_TREASURIES, BASE_CORP_BONDS } from './marketData'

interface Props {
  open: boolean
  onClose: () => void
  variant?: 'modal' | 'panel'
}

const ACCOUNTS      = ['RATES-01', 'RATES-02', 'CREDIT-01', 'CREDIT-02', 'MACRO-01']
const COUNTERPARTIES = ['JPMorgan', 'Goldman Sachs', 'Barclays', 'Citigroup', 'Morgan Stanley', 'Deutsche Bank', 'Bank of America', 'UBS', 'CME Globex']
const VENUES        = ['TradeWeb', 'MarketAxess', 'Bloomberg', 'CME Globex', 'Direct']
const TIF           = ['Day', 'GTC', 'IOC', 'FOK']

const SECURITY_LIST = [
  ...BASE_TREASURIES.map(t => ({ label: t.label, cusip: t.cusip, type: 'Treasury',    yield: t.bidYield, price: t.bidPrice })),
  ...BASE_CORP_BONDS.map(b => ({ label: b.description, cusip: b.cusip, type: b.isHY ? 'High Yield' : 'IG Corporate', yield: b.bidYield, price: b.bidPrice })),
]

export function OrderTicket({ open, onClose, variant = 'modal' }: Props) {
  const [side, setSide]               = useState<'Buy' | 'Sell'>('Buy')
  const [secSearch, setSecSearch]     = useState('')
  const [selectedSec, setSelectedSec] = useState<typeof SECURITY_LIST[0] | null>(null)
  const [priceMode, setPriceMode]     = useState<'yield' | 'price'>('yield')
  const [faceValue, setFaceValue]     = useState('10')
  const [limitYield, setLimitYield]   = useState('')
  const [limitPrice, setLimitPrice]   = useState('')
  const [account, setAccount]         = useState(ACCOUNTS[0])
  const [cpty, setCpty]               = useState(COUNTERPARTIES[0])
  const [venue, setVenue]             = useState(VENUES[0])
  const [tif, setTif]                 = useState(TIF[0])
  const [settleDate, setSettleDate]   = useState('T+1')
  const [submitted, setSubmitted]     = useState(false)
  const [showSecList, setShowSecList] = useState(false)

  if (!open) return null

  const filteredSec = SECURITY_LIST.filter(s =>
    s.label.toLowerCase().includes(secSearch.toLowerCase()) ||
    s.cusip.toLowerCase().includes(secSearch.toLowerCase())
  ).slice(0, 8)

  const handleSelectSec = (s: typeof SECURITY_LIST[0]) => {
    setSelectedSec(s)
    setSecSearch(s.label)
    setShowSecList(false)
    if (priceMode === 'yield') setLimitYield(s.yield.toFixed(3))
    else setLimitPrice(s.price.toFixed(3))
    setSettleDate(s.type === 'Treasury' ? 'T+1' : 'T+3')
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); onClose() }, 1800)
  }

  const formContent = (
    <div className="px-4 py-3 space-y-3">
      {/* Side selector */}
      <div className="flex rounded-full bg-secondary border border-border p-0.5">
        {(['Buy', 'Sell'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={cn(
              'flex-1 py-2 rounded-full text-sm font-semibold tracking-tight transition-all',
              side === s
                ? s === 'Buy' ? 'bg-buy text-white shadow-sm' : 'bg-sell text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {s === 'Buy' ? 'Buy / Long' : 'Sell / Short'}
          </button>
        ))}
      </div>

      {/* Security search */}
      <div className="space-y-1 relative">
        <label className="text-[11px] text-muted-foreground uppercase tracking-wide">Security</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={secSearch}
            onChange={e => { setSecSearch(e.target.value); setShowSecList(true) }}
            onFocus={() => setShowSecList(true)}
            placeholder="Search CUSIP, Ticker, Description..."
            className="w-full pl-9 pr-3 py-1.5 bg-input border border-border rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/70 transition-colors"
          />
        </div>
        {showSecList && secSearch && filteredSec.length > 0 && (
          <div className="absolute z-10 w-full bg-card border border-border rounded-lg shadow-lg mt-1 divide-y divide-border max-h-44 overflow-y-auto">
            {filteredSec.map(s => (
              <button
                key={s.cusip}
                onClick={() => handleSelectSec(s)}
                className="w-full text-left px-3 py-1.5 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium">{s.label}</span>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium',
                    s.type === 'Treasury'   ? 'bg-primary/15 text-primary' :
                    s.type === 'High Yield' ? 'bg-sell/15 text-sell' : 'bg-buy/15 text-buy'
                  )}>{s.type}</span>
                </div>
                <div className="flex gap-4 mt-0.5 text-[10px] text-muted-foreground font-mono">
                  <span>CUSIP: {s.cusip}</span>
                  <span>Yield: {s.yield.toFixed(3)}%</span>
                  <span>Price: {s.price.toFixed(3)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {selectedSec && (
          <div className="flex gap-4 text-[10px] text-muted-foreground font-mono px-1">
            <span>CUSIP: {selectedSec.cusip}</span>
            <span>Mid Yield: {selectedSec.yield.toFixed(3)}%</span>
            <span>Price: {selectedSec.price.toFixed(3)}</span>
          </div>
        )}
      </div>

      {/* Face value + Limit */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] text-muted-foreground uppercase tracking-wide">Face Value ($MM)</label>
          <input
            type="number"
            value={faceValue}
            onChange={e => setFaceValue(e.target.value)}
            min="1"
            className="w-full px-3 py-1.5 bg-input border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/70 transition-colors"
          />
          <div className="text-[10px] text-muted-foreground px-1">
            Notional: ${(parseFloat(faceValue || '0') * 1_000_000).toLocaleString()}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Limit {priceMode === 'yield' ? 'Yield' : 'Price'}
            </label>
            <button
              onClick={() => setPriceMode(m => m === 'yield' ? 'price' : 'yield')}
              className="text-[10px] text-primary hover:underline"
            >
              → {priceMode === 'yield' ? 'Price' : 'Yield'}
            </button>
          </div>
          <input
            type="number"
            step="0.001"
            value={priceMode === 'yield' ? limitYield : limitPrice}
            onChange={e => priceMode === 'yield' ? setLimitYield(e.target.value) : setLimitPrice(e.target.value)}
            placeholder={priceMode === 'yield' ? '4.380' : '98.875'}
            className="w-full px-3 py-1.5 bg-input border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/70 transition-colors"
          />
          <div className="text-[10px] text-muted-foreground px-1">
            {priceMode === 'yield' ? 'Enter yield in %' : 'Enter clean price'}
          </div>
        </div>
      </div>

      {/* Execution details */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Account',       value: account, set: setAccount, opts: ACCOUNTS },
          { label: 'Counterparty',  value: cpty,    set: setCpty,    opts: COUNTERPARTIES },
          { label: 'Venue',         value: venue,   set: setVenue,   opts: VENUES },
          { label: 'Time-in-Force', value: tif,     set: setTif,     opts: TIF },
        ].map(({ label, value, set, opts }) => (
          <div key={label} className="space-y-1">
            <label className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</label>
            <select
              value={value}
              onChange={e => set(e.target.value)}
              className="w-full px-3 py-1.5 bg-input border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/70 appearance-none transition-colors"
            >
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Settlement */}
      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground uppercase tracking-wide">Settlement</label>
        <div className="flex gap-1.5">
          {['T+1', 'T+2', 'T+3', 'T+5'].map(s => (
            <button
              key={s}
              onClick={() => setSettleDate(s)}
              className={cn(
                'flex-1 py-1 rounded-md text-xs font-mono font-medium border transition-colors',
                settleDate === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Order summary */}
      {selectedSec && (
        <div className={cn('rounded-lg px-3 py-2.5 text-[11px] border', side === 'Buy' ? 'bg-buy/8 border-buy/20' : 'bg-sell/8 border-sell/20')}>
          <div className="font-semibold mb-1 text-xs">Order Summary</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-muted-foreground">
            <span>{side} {faceValue}MM</span>
            <span className="truncate">{selectedSec.label}</span>
            <span>Limit: {priceMode === 'yield' ? (limitYield || '—') + '%' : (limitPrice || '—')}</span>
            <span>Settle: {settleDate}</span>
            <span>Via: {venue}</span>
            <span>TIF: {tif}</span>
          </div>
        </div>
      )}
    </div>
  )

  const footer = (
    <div className="px-4 py-3 border-t border-border flex items-center gap-2">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={!selectedSec || submitted}
        className={cn(
          'flex-1 py-2 rounded-full text-sm font-semibold tracking-tight transition-all',
          submitted
            ? 'bg-buy text-white opacity-80 cursor-not-allowed'
            : side === 'Buy'
              ? 'bg-buy hover:opacity-90 text-white disabled:opacity-40'
              : 'bg-sell hover:opacity-90 text-white disabled:opacity-40'
        )}
      >
        {submitted ? '✓ Order Submitted' : `Submit ${side} Order`}
      </button>
    </div>
  )

  if (variant === 'panel') {
    return (
      <div className="h-full flex flex-col bg-card overflow-y-auto">
        {formContent}
        {footer}
      </div>
    )
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="w-[480px] max-w-[95vw] max-h-[90vh] p-0 rounded-xl overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-3 border-b border-border bg-secondary/30 mb-0 shrink-0" onClose={onClose}>
          <DialogTitle>New Order</DialogTitle>
          <DialogDescription>Fixed Income · RFQ / Limit</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 min-h-0">
          {formContent}
        </div>
        <div className="shrink-0">
          {footer}
        </div>
      </DialogContent>
    </Dialog>
  )
}
