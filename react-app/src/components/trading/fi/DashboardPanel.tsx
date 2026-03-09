import { cn } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Treasury, CorpBond, YieldCurvePoint, CDXIndex } from './marketData'
import { fmtYield, fmtBps, fmtPnL, fmtDV01, BASE_ORDERS, BASE_POSITIONS } from './marketData'

interface Props {
  treasuries: Treasury[]
  corpBonds: CorpBond[]
  yieldCurve: YieldCurvePoint[]
  cdxIndices: CDXIndex[]
}

const TOTAL_PNL_TODAY = 93_170
const TOTAL_PNL_MTD   = 243_135
const TOTAL_PNL_YTD   = 590_320
const TOTAL_DV01       = 420_945
const TOTAL_CS01       = 57_182

function KpiCard({ label, value, sub, valueClass }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-col gap-0.5">
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className={cn('text-xl font-semibold font-mono leading-tight mt-0.5', valueClass)}>{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground mt-0.5">{sub}</span>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Filled:    'bg-buy/15 text-buy',
    Working:   'bg-primary/15 text-primary',
    Partial:   'bg-warning/15 text-warning',
    Cancelled: 'bg-muted text-muted-foreground',
  }
  return <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', cls[status] ?? 'bg-muted text-muted-foreground')}>{status}</span>
}

export function DashboardPanel({ treasuries, yieldCurve, cdxIndices }: Props) {
  const tsy2Y  = treasuries.find(t => t.tenor === '2Y')
  const tsy10Y = treasuries.find(t => t.tenor === '10Y')
  const tsy30Y = treasuries.find(t => t.tenor === '30Y')
  const cdxIG  = cdxIndices.find(c => c.name.includes('NA.IG') && c.tenor === '5Y')
  const cdxHY  = cdxIndices.find(c => c.name.includes('NA.HY'))

  const recentOrders = BASE_ORDERS.slice(-6).reverse()
  const benchmarks = [
    { label: '2Y  UST', yield: tsy2Y?.bidYield,  change: tsy2Y?.change },
    { label: '10Y UST', yield: tsy10Y?.bidYield, change: tsy10Y?.change },
    { label: '30Y UST', yield: tsy30Y?.bidYield, change: tsy30Y?.change },
    { label: 'CDX IG',  yield: cdxIG ? (cdxIG.bidSpread + cdxIG.askSpread) / 2 : undefined,  change: cdxIG?.change, isBps: true },
    { label: 'CDX HY',  yield: cdxHY ? (cdxHY.bidSpread + cdxHY.askSpread) / 2 : undefined, change: cdxHY?.change, isBps: true },
  ]

  const yMin = Math.floor(Math.min(...yieldCurve.map(d => d.yield)) * 10) / 10 - 0.1
  const yMax = Math.ceil (Math.max(...yieldCurve.map(d => d.yield)) * 10) / 10 + 0.1

  return (
    <div className="h-full flex flex-col gap-3 p-3 overflow-hidden">

      {/* KPI row */}
      <div className="grid grid-cols-5 gap-2 shrink-0">
        <KpiCard label="P&L Today"   value={fmtPnL(TOTAL_PNL_TODAY)} valueClass={TOTAL_PNL_TODAY >= 0 ? 'text-buy' : 'text-sell'} sub="All strategies" />
        <KpiCard label="P&L MTD"     value={fmtPnL(TOTAL_PNL_MTD)}   valueClass={TOTAL_PNL_MTD >= 0 ? 'text-buy' : 'text-sell'}  sub="March 2026" />
        <KpiCard label="P&L YTD"     value={fmtPnL(TOTAL_PNL_YTD)}   valueClass={TOTAL_PNL_YTD >= 0 ? 'text-buy' : 'text-sell'}  sub="Since Jan 1" />
        <KpiCard label="Net DV01"    value={fmtDV01(TOTAL_DV01)}      sub="Portfolio rate sensitivity" />
        <KpiCard label="Net CS01"    value={fmtDV01(TOTAL_CS01)}      sub="Portfolio credit sensitivity" />
      </div>

      {/* Yield curve + benchmarks — expands to fill remaining height */}
      <div className="flex-1 min-h-0 grid grid-cols-3 gap-3">

        {/* Yield curve — chart fills the card height */}
        <div className="col-span-2 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
            <div>
              <span className="text-xs font-semibold">US Treasury Yield Curve</span>
              <span className="ml-2 text-[10px] text-muted-foreground">On-The-Run  ·  Live</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary rounded inline-block" /> Today</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-muted-foreground rounded inline-block opacity-50" /> Prev Close</span>
            </div>
          </div>
          <div className="flex-1 p-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldCurve} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} />
                <XAxis dataKey="tenor" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[yMin, yMax]} tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1) + '%'} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, fontSize: 11 }}
                  formatter={(v: any) => [v.toFixed(3) + '%', 'Yield']}
                  labelStyle={{ color: 'var(--color-muted-foreground)', marginBottom: 2 }}
                />
                <Area type="monotone" dataKey="prevYield" stroke="var(--color-muted-foreground)" strokeWidth={1} strokeDasharray="3 3" fill="none" dot={false} />
                <Area type="monotone" dataKey="yield" stroke="var(--color-primary)" strokeWidth={2} fill="url(#yieldGrad)" dot={{ r: 2.5, fill: 'var(--color-primary)', strokeWidth: 0 }} activeDot={{ r: 4 }} />
                <ReferenceLine y={0} stroke="var(--color-border)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Benchmarks */}
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-border shrink-0">
            <span className="text-xs font-semibold">Key Benchmarks</span>
          </div>
          <div className="divide-y divide-border flex-1">
            {benchmarks.map(b => (
              <div key={b.label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-muted-foreground font-mono">{b.label}</span>
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold">
                    {b.yield !== undefined ? (b.isBps ? b.yield.toFixed(1) + ' bps' : fmtYield(b.yield)) : '—'}
                  </div>
                  {b.change !== undefined && (
                    <div className={cn('text-[10px] font-mono', b.change < 0 ? 'text-buy' : 'text-sell')}>
                      {fmtBps(b.change)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-muted-foreground font-mono">2s10s Slope</span>
              <div className="text-right">
                {tsy2Y && tsy10Y && (() => {
                  const slope = Math.round((tsy10Y.bidYield - tsy2Y.bidYield) * 100)
                  return (
                    <div className={cn('text-sm font-mono font-semibold', slope < 0 ? 'text-sell' : 'text-buy')}>
                      {slope > 0 ? '+' : ''}{slope} bps
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Position summary + Recent orders — fixed height, scrollable inside */}
      <div className="grid grid-cols-3 gap-3 shrink-0 h-[210px]">

        {/* Position summary */}
        <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border shrink-0">
            <span className="text-xs font-semibold">Position Summary</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {BASE_POSITIONS.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 py-1.5 text-[11px]">
                <div>
                  <div className={cn('font-medium', p.direction === 'Long' ? 'text-buy' : 'text-sell')}>
                    {p.direction === 'Long' ? '▲' : '▼'} {p.security}
                  </div>
                  <div className="text-muted-foreground">{p.assetClass}</div>
                </div>
                <div className="text-right font-mono">
                  <div className={cn(p.pnlToday >= 0 ? 'text-buy' : 'text-sell')}>{fmtPnL(p.pnlToday)}</div>
                  <div className="text-muted-foreground text-[10px]">{fmtDV01(Math.abs(p.dv01))} dv01</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="col-span-2 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold">Recent Orders</span>
            <span className="text-[10px] text-muted-foreground">Today  ·  {BASE_ORDERS.length} orders</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-4 py-1.5 font-medium">Time</th>
                  <th className="text-left px-2 py-1.5 font-medium">Security</th>
                  <th className="text-left px-2 py-1.5 font-medium">Side</th>
                  <th className="text-right px-2 py-1.5 font-medium">Size</th>
                  <th className="text-right px-2 py-1.5 font-medium">Yield/Price</th>
                  <th className="text-right px-4 py-1.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map(o => (
                  <tr key={o.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-1.5 text-muted-foreground font-mono">{o.time}</td>
                    <td className="px-2 py-1.5">
                      <div className="font-medium">{o.security}</div>
                      <div className="text-muted-foreground text-[10px]">{o.account}</div>
                    </td>
                    <td className="px-2 py-1.5">
                      <span className={cn('font-semibold', o.side === 'Buy' ? 'text-buy' : 'text-sell')}>{o.side}</span>
                    </td>
                    <td className="px-2 py-1.5 text-right font-mono">
                      {o.cusip.startsWith('CME') ? `${o.faceValueMM} cts` : `$${o.faceValueMM}MM`}
                    </td>
                    <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">
                      {o.avgFillYield ? o.avgFillYield.toFixed(3) + '%' : o.limitPrice ? o.limitPrice.toFixed(3) : '—'}
                    </td>
                    <td className="px-4 py-1.5 text-right"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
