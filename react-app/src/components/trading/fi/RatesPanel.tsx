import { useState, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllEnterpriseModule } from 'ag-grid-enterprise'
import type { ColDef, ICellRendererParams, RowClickedEvent } from 'ag-grid-community'
import { cn } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import type { Treasury, YieldCurvePoint } from './marketData'
import { fmtYield, fmtPrice } from './marketData'
import { marketsUITheme } from './agGridTheme'

interface Props {
  treasuries: Treasury[]
  yieldCurve: YieldCurvePoint[]
}

const CURVE_SPREADS = [
  { label: '2s5s',     tenors: ['2Y', '5Y'] },
  { label: '5s10s',    tenors: ['5Y', '10Y'] },
  { label: '2s10s',    tenors: ['2Y', '10Y'] },
  { label: '5s30s',    tenors: ['5Y', '30Y'] },
  { label: '2s5s10s',  tenors: ['2Y', '5Y', '10Y'],  isFly: true },
  { label: '5s10s30s', tenors: ['5Y', '10Y', '30Y'], isFly: true },
]


export function RatesPanel({ treasuries, yieldCurve }: Props) {
  const [selectedTenor, setSelectedTenor] = useState<string | null>(null)

  const yMap = Object.fromEntries(treasuries.map(t => [t.tenor, t.bidYield]))

  function getSpread(t1: string, t2: string) {
    const y1 = yMap[t1]; const y2 = yMap[t2]
    if (!y1 || !y2) return null
    return Math.round((y2 - y1) * 100 * 10) / 10
  }

  function getFly(t1: string, t2: string, t3: string) {
    const y1 = yMap[t1]; const y2 = yMap[t2]; const y3 = yMap[t3]
    if (!y1 || !y2 || !y3) return null
    return Math.round((-y1 + 2 * y2 - y3) * 100 * 10) / 10
  }

  const yMin = Math.floor(Math.min(...yieldCurve.map(d => d.yield)) * 10) / 10 - 0.05
  const yMax = Math.ceil (Math.max(...yieldCurve.map(d => d.yield)) * 10) / 10 + 0.05
  const krdData = treasuries.filter(t => !['1M','3M','6M','1Y'].includes(t.tenor))
  const selectedT = treasuries.find(x => x.tenor === selectedTenor)

  const colDefs = useMemo<ColDef<Treasury>[]>(() => [
    { field: 'tenor',       headerName: 'Tenor',    width: 60,  cellClass: 'font-semibold' },
    { field: 'label',       headerName: 'Security', flex: 1,    cellClass: 'text-muted-foreground', minWidth: 140 },
    { field: 'coupon',      headerName: 'Cpn',      width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => p.value.toFixed(3) + '%' },
    { field: 'maturity',    headerName: 'Maturity', width: 88,  cellClass: 'font-mono text-muted-foreground' },
    { field: 'bidYield',    headerName: 'Bid Yld',  width: 80,  type: 'numericColumn', cellClass: 'font-mono font-semibold text-buy', valueFormatter: p => fmtYield(p.value) },
    { field: 'askYield',    headerName: 'Ask Yld',  width: 78,  type: 'numericColumn', cellClass: 'font-mono text-sell', valueFormatter: p => fmtYield(p.value) },
    { field: 'bidPrice',    headerName: 'Bid Px',   width: 76,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => fmtPrice(p.value) },
    { field: 'askPrice',    headerName: 'Ask Px',   width: 76,  type: 'numericColumn', cellClass: 'font-mono text-muted-foreground', valueFormatter: p => fmtPrice(p.value) },
    {
      field: 'change', headerName: 'Chg (bps)', width: 82, type: 'numericColumn',
      cellStyle: p => ({ color: p.value < 0 ? 'var(--color-buy)' : p.value > 0 ? 'var(--color-sell)' : undefined }),
      valueFormatter: p => (p.value >= 0 ? '+' : '') + p.value.toFixed(1),
      cellClass: 'font-mono',
    },
    { field: 'modDuration', headerName: 'Mod Dur',  width: 76,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => p.value.toFixed(3) },
    { field: 'dv01PerMM',   headerName: 'DV01/MM',  width: 84,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => '$' + p.value.toLocaleString() },
  ], [])

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true, minWidth: 50 }), [])

  const onRowClicked = useCallback((e: RowClickedEvent<Treasury>) => {
    setSelectedTenor(prev => prev === e.data?.tenor ? null : (e.data?.tenor ?? null))
  }, [])

  return (
    <div className="h-full flex flex-col gap-3 p-3 overflow-hidden">

      {/* Main area: treasury grid (left) + sidebar (right) */}
      <div className="flex-1 min-h-0 grid grid-cols-[1fr_272px] gap-3">

        {/* Treasury AG Grid */}
        <div className="flex flex-col overflow-hidden gap-0">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div>
              <span className="text-xs font-semibold">On-The-Run US Treasuries</span>
              <span className="ml-2 text-[10px] text-muted-foreground">Settlement T+1</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Bid/Ask yields · Clean prices</span>
          </div>
          <div className="flex-1 min-h-0">
            <AgGridReact<Treasury>
              theme={marketsUITheme}
              modules={[AllEnterpriseModule]}
              rowData={treasuries}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              rowHeight={34}
              headerHeight={30}
              rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
              onRowClicked={onRowClicked}
              suppressCellFocus
              enableCellTextSelection
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </div>

        {/* Right sidebar — 3 stacked sections */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Yield Curve chart */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shrink-0">
            <div className="px-4 py-2 border-b border-border flex items-center gap-2">
              <span className="text-xs font-semibold">Yield Curve</span>
              <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-px bg-primary inline-block" /> Today</span>
                <span className="flex items-center gap-1"><span className="w-3 h-px bg-muted-foreground inline-block opacity-50" /> Prior</span>
              </div>
            </div>
            <div className="p-2 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldCurve} margin={{ top: 4, right: 6, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ratesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} />
                  <XAxis dataKey="tenor" tick={{ fontSize: 8, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[yMin, yMax]} tick={{ fontSize: 8, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1)} width={28} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 10 }}
                    formatter={(v: any) => [v.toFixed(3) + '%', 'Yield']}
                  />
                  <Area type="monotone" dataKey="prevYield" stroke="var(--color-muted-foreground)" strokeWidth={1} strokeDasharray="3 3" fill="none" dot={false} />
                  <Area type="monotone" dataKey="yield" stroke="var(--color-primary)" strokeWidth={1.5} fill="url(#ratesGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Curve spreads — compact 2-column grid */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shrink-0">
            <div className="px-4 py-2 border-b border-border">
              <span className="text-xs font-semibold">Curve Spreads</span>
              <span className="ml-2 text-[10px] text-muted-foreground">bps</span>
            </div>
            <div className="grid grid-cols-2">
              {CURVE_SPREADS.map((s, i) => {
                const val = s.isFly
                  ? getFly(s.tenors[0], s.tenors[1], s.tenors[2])
                  : getSpread(s.tenors[0], s.tenors[1])
                return (
                  <div
                    key={s.label}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-[11px]',
                      i % 2 === 0 && 'border-r border-border',
                      i < CURVE_SPREADS.length - 2 && 'border-b border-border'
                    )}
                  >
                    <span className="text-muted-foreground font-mono">{s.label}</span>
                    <span className={cn('font-mono font-semibold', val !== null && val < 0 ? 'text-sell' : 'text-buy')}>
                      {val !== null ? (val > 0 ? '+' : '') + val.toFixed(1) : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CUSIP detail (when row selected) OR KRD chart */}
          <div className="bg-card border border-border rounded-xl overflow-hidden flex-1 min-h-0">
            {selectedT ? (
              <>
                <div className="px-4 py-2 border-b border-border flex items-center justify-between shrink-0">
                  <span className="text-xs font-semibold">CUSIP Detail · {selectedT.tenor}</span>
                  <button onClick={() => setSelectedTenor(null)} className="text-muted-foreground hover:text-foreground leading-none px-1">×</button>
                </div>
                <div className="px-4 py-3 space-y-2 text-[11px] font-mono overflow-y-auto">
                  {[
                    ['CUSIP',    selectedT.cusip],
                    ['Coupon',   selectedT.coupon.toFixed(3) + '%'],
                    ['Maturity', selectedT.maturity],
                    ['Mid Yield',fmtYield((selectedT.bidYield + selectedT.askYield) / 2)],
                    ['Bid/Ask',  fmtPrice(selectedT.bidPrice) + ' / ' + fmtPrice(selectedT.askPrice)],
                    ['Mod Dur',  selectedT.modDuration.toFixed(3)],
                    ['DV01/MM',  '$' + selectedT.dv01PerMM.toLocaleString()],
                    ['Settle',   'T+1'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-border shrink-0">
                  <span className="text-xs font-semibold">Key Rate Duration</span>
                  <span className="ml-2 text-[10px] text-muted-foreground">bps change by tenor</span>
                </div>
                <div className="p-2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={krdData} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} vertical={false} />
                      <XAxis dataKey="tenor" tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => v + 'bp'} width={28} />
                      <Tooltip
                        contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11 }}
                        formatter={(v: any) => [v.toFixed(1) + ' bps', 'Yield Chg']}
                      />
                      <Bar dataKey="change" radius={[3, 3, 0, 0]}>
                        {krdData.map(t => (
                          <Cell key={t.tenor} fill={t.change < 0 ? 'var(--color-buy)' : 'var(--color-sell)'} fillOpacity={0.75} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
