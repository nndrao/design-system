import { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllEnterpriseModule } from 'ag-grid-enterprise'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TreasuryFuture, SOFRFuture } from './marketData'
import { fmtK } from './marketData'
import { marketsUITheme } from './agGridTheme'

interface Props {
  tFutures: TreasuryFuture[]
  sofrFutures: SOFRFuture[]
}

function to32nds(price: number) {
  const whole = Math.floor(price)
  const frac  = price - whole
  const t32   = frac * 32
  const t32i  = Math.floor(t32)
  const half  = t32 - t32i >= 0.5 ? '+' : ''
  return `${whole}-${String(t32i).padStart(2, '0')}${half}`
}

// ── Cell renderers ────────────────────────────────────────────────────────────

const ChgRenderer = ({ value }: ICellRendererParams) => (
  <span style={{ color: (value as number) < 0 ? 'var(--color-sell)' : (value as number) > 0 ? 'var(--color-buy)' : undefined }} className="font-mono">
    {(value as number) > 0 ? '+' : ''}{(value as number).toFixed(3)}
  </span>
)

const Nds32Renderer = ({ data }: ICellRendererParams<TreasuryFuture>) => (
  <span className="font-mono text-muted-foreground text-[10px]">({to32nds(data?.lastPrice ?? 0)})</span>
)

const SymbolRenderer = ({ value }: ICellRendererParams) => (
  <span className="font-semibold text-primary font-mono">{value}</span>
)

const ImpliedRateRenderer = ({ value, data }: ICellRendererParams<SOFRFuture>) => (
  <span style={{ color: (data?.change ?? 0) < 0 ? 'var(--color-sell)' : 'var(--color-buy)' }} className="font-mono font-semibold">
    {(value as number).toFixed(3)}%
  </span>
)

// ── Component ─────────────────────────────────────────────────────────────────

export function FuturesPanel({ tFutures, sofrFutures }: Props) {
  const forwardCurveData = sofrFutures.map(f => ({ contract: f.contract, rate: f.impliedRate }))
  const yMin = Math.min(...sofrFutures.map(f => f.impliedRate)) - 0.1
  const yMax = Math.max(...sofrFutures.map(f => f.impliedRate)) + 0.1

  const tColDefs = useMemo<ColDef<TreasuryFuture>[]>(() => [
    { field: 'symbol',          headerName: 'Symbol',   width: 64,  cellRenderer: SymbolRenderer },
    { field: 'description',     headerName: 'Desc',     flex: 1,    cellClass: 'text-muted-foreground text-[10px]', minWidth: 100 },
    { field: 'bidPrice',        headerName: 'Bid',      width: 72,  type: 'numericColumn', cellClass: 'font-mono font-semibold text-buy', valueFormatter: p => p.value.toFixed(3) },
    { field: 'askPrice',        headerName: 'Ask',      width: 72,  type: 'numericColumn', cellClass: 'font-mono text-sell', valueFormatter: p => p.value.toFixed(3) },
    { field: 'lastPrice',       headerName: 'Last',     width: 72,  type: 'numericColumn', cellClass: 'font-mono font-semibold', valueFormatter: p => p.value.toFixed(3) },
    { colId: '32nds',           headerName: '(32nds)',  width: 72,  cellRenderer: Nds32Renderer, sortable: false },
    { field: 'change',          headerName: 'Chg',      width: 68,  type: 'numericColumn', cellRenderer: ChgRenderer },
    { field: 'settle',          headerName: 'Settle',   width: 72,  type: 'numericColumn', cellClass: 'font-mono text-muted-foreground', valueFormatter: p => p.value.toFixed(3) },
    { field: 'high',            headerName: 'High',     width: 68,  type: 'numericColumn', cellClass: 'font-mono text-buy/70', valueFormatter: p => p.value.toFixed(3) },
    { field: 'low',             headerName: 'Low',      width: 68,  type: 'numericColumn', cellClass: 'font-mono text-sell/70', valueFormatter: p => p.value.toFixed(3) },
    { field: 'dv01PerContract', headerName: 'DV01/ct',  width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => '$' + p.value },
    { field: 'openInterest',    headerName: 'Open Int', width: 78,  type: 'numericColumn', cellClass: 'font-mono text-muted-foreground', valueFormatter: p => fmtK(p.value) },
    { field: 'volume',          headerName: 'Volume',   width: 72,  type: 'numericColumn', cellClass: 'font-mono text-muted-foreground', valueFormatter: p => fmtK(p.value) },
  ], [])

  const sColDefs = useMemo<ColDef<SOFRFuture>[]>(() => [
    { field: 'contract',     headerName: 'Contract',  flex: 1,  cellClass: 'text-muted-foreground', minWidth: 80 },
    { field: 'symbol',       headerName: 'Symbol',    width: 72, cellRenderer: SymbolRenderer },
    { field: 'price',        headerName: 'Price',     width: 72, type: 'numericColumn', cellClass: 'font-mono font-semibold', valueFormatter: p => p.value.toFixed(3) },
    { field: 'change',       headerName: 'Chg',       width: 68, type: 'numericColumn', cellRenderer: ChgRenderer },
    { field: 'impliedRate',  headerName: 'Impl Rate', width: 84, type: 'numericColumn', cellRenderer: ImpliedRateRenderer },
    { field: 'volume',       headerName: 'Volume',    width: 72, type: 'numericColumn', cellClass: 'font-mono text-muted-foreground', valueFormatter: p => fmtK(p.value) },
    { field: 'openInterest', headerName: 'Open Int',  width: 78, type: 'numericColumn', cellClass: 'font-mono text-muted-foreground', valueFormatter: p => fmtK(p.value) },
  ], [])

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true, minWidth: 50 }), [])

  return (
    <div className="h-full flex flex-col gap-3 p-3 overflow-hidden">

      {/* Top: Treasury futures grid + SOFR forward curve */}
      <div className="flex-1 min-h-0 grid grid-cols-[1fr_320px] gap-3">

        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div>
              <span className="text-xs font-semibold">US Treasury Futures</span>
              <span className="ml-2 text-[10px] text-muted-foreground">CME Globex · Mar-26</span>
            </div>
            <span className="text-[10px] text-muted-foreground">32nds in parentheses</span>
          </div>
          <div className="flex-1 min-h-0">
            <AgGridReact<TreasuryFuture>
              theme={marketsUITheme}
              modules={[AllEnterpriseModule]}
              rowData={tFutures}
              columnDefs={tColDefs}
              defaultColDef={defaultColDef}
              rowHeight={34}
              headerHeight={30}
              suppressCellFocus
              enableCellTextSelection
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-border shrink-0">
            <span className="text-xs font-semibold">SOFR Implied Forward Rate Curve</span>
            <span className="ml-2 text-[10px] text-muted-foreground">From futures prices</span>
          </div>
          <div className="flex-1 p-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forwardCurveData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} />
                <XAxis dataKey="contract" tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[yMin, yMax]} tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(2) + '%'} width={40} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11 }} formatter={(v: number) => [v.toFixed(3) + '%', 'Implied SOFR']} />
                <Line type="monotone" dataKey="rate" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-primary)', strokeWidth: 0 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="border-t border-border px-4 py-2.5 grid grid-cols-3 gap-2 text-[10px] shrink-0">
            <div>
              <div className="text-muted-foreground">Nearest</div>
              <div className="font-mono font-semibold">{sofrFutures[0]?.impliedRate.toFixed(3)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Farthest</div>
              <div className="font-mono font-semibold">{sofrFutures[sofrFutures.length - 1]?.impliedRate.toFixed(3)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Steepness</div>
              <div className="font-mono font-semibold text-buy">
                {sofrFutures.length > 1 ? (-(sofrFutures[sofrFutures.length - 1].impliedRate - sofrFutures[0].impliedRate) * 100).toFixed(0) + ' bps' : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: SOFR strip grid */}
      <div className="shrink-0 h-[200px]">
        <div className="flex items-center mb-2 shrink-0">
          <span className="text-xs font-semibold">3-Month SOFR Futures Strip</span>
          <span className="ml-2 text-[10px] text-muted-foreground">CME SR3 · 100 − Implied SOFR Rate</span>
        </div>
        <div style={{ height: 'calc(100% - 28px)' }}>
          <AgGridReact<SOFRFuture>
            theme={marketsUITheme}
            modules={[AllEnterpriseModule]}
            rowData={sofrFutures}
            columnDefs={sColDefs}
            defaultColDef={defaultColDef}
            rowHeight={30}
            headerHeight={28}
            suppressCellFocus
            enableCellTextSelection
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}
