import { useMemo, useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllEnterpriseModule } from 'ag-grid-enterprise'
import type { ColDef, ICellRendererParams, RowClickedEvent, GridReadyEvent } from 'ag-grid-community'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { cn } from '@/lib/utils'
import { BASE_POSITIONS, fmtPnL, fmtDV01, fmtPrice, fmtYield, type Position } from './marketData'
import { marketsUITheme } from './agGridTheme'

// ── Derived totals ─────────────────────────────────────────────────────────────

const totalPnlToday = BASE_POSITIONS.reduce((s, p) => s + p.pnlToday, 0)
const totalPnlMtd   = BASE_POSITIONS.reduce((s, p) => s + p.pnlMtd,   0)
const totalPnlYtd   = BASE_POSITIONS.reduce((s, p) => s + p.pnlYtd,   0)
const totalDV01     = BASE_POSITIONS.reduce((s, p) => s + p.dv01, 0)
const totalCS01     = BASE_POSITIONS.reduce((s, p) => s + p.cs01, 0)
const totalMktVal   = BASE_POSITIONS.filter(p => p.marketValueMM !== 0).reduce((s, p) => s + p.marketValueMM, 0)

const DV01_BY_CLASS = [
  { label: 'Treasury',  dv01: BASE_POSITIONS.filter(p => p.assetClass === 'Treasury').reduce((s, p) => s + p.dv01, 0) },
  { label: 'Corporate', dv01: BASE_POSITIONS.filter(p => p.assetClass === 'Corporate').reduce((s, p) => s + p.dv01, 0) },
  { label: 'Futures',   dv01: BASE_POSITIONS.filter(p => p.assetClass === 'Future').reduce((s, p) => s + p.dv01, 0) },
  { label: 'CDS',       dv01: BASE_POSITIONS.filter(p => p.assetClass === 'CDS').reduce((s, p) => s + p.dv01, 0) },
]

// ── Cell renderers ────────────────────────────────────────────────────────────

const DirectionRenderer = ({ value }: ICellRendererParams) => (
  <span className={cn(
    'text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide',
    value === 'Long' ? 'bg-buy/15 text-buy' : 'bg-sell/15 text-sell',
  )}>
    {value === 'Long' ? 'LONG' : 'SHORT'}
  </span>
)

const AssetClassRenderer = ({ value }: ICellRendererParams) => {
  const colors: Record<string, string> = {
    Treasury: 'text-primary', Corporate: 'text-buy', Future: 'text-warning', CDS: 'text-sell',
  }
  return <span className={cn('text-[10px] font-medium', colors[value] ?? 'text-muted-foreground')}>{value}</span>
}

const SecurityRenderer = ({ data }: ICellRendererParams<Position>) => (
  <div className="flex flex-col justify-center h-full leading-none gap-0.5">
    <div className="font-semibold text-[11px]">{data?.security}</div>
    <div className="text-[10px] text-muted-foreground font-mono">{data?.cusip}</div>
  </div>
)

const PnlRenderer = ({ value }: ICellRendererParams) => (
  <span className={cn('font-mono font-semibold', value >= 0 ? 'text-buy' : 'text-sell')}>{fmtPnL(value)}</span>
)

const PnlMutedRenderer = ({ value }: ICellRendererParams) => (
  <span className={cn('font-mono', value >= 0 ? 'text-buy' : 'text-sell')}>{fmtPnL(value)}</span>
)

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, valueClass }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-col gap-0.5">
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className={cn('text-xl font-semibold font-mono leading-tight mt-0.5', valueClass)}>{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground mt-0.5">{sub}</span>}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

type AssetFilter = 'All' | 'Treasury' | 'Corporate' | 'Future' | 'CDS'
const ASSET_FILTERS: AssetFilter[] = ['All', 'Treasury', 'Corporate', 'Future', 'CDS']

export function PositionsPanel() {
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('All')
  const [selected, setSelected] = useState<Position | null>(null)

  const rowData = useMemo(() =>
    assetFilter === 'All' ? BASE_POSITIONS : BASE_POSITIONS.filter(p => p.assetClass === assetFilter),
    [assetFilter],
  )

  const colDefs = useMemo<ColDef<Position>[]>(() => [
    {
      field: 'security',
      headerName: 'Security',
      width: 160,
      cellRenderer: SecurityRenderer,
      filter: 'agTextColumnFilter',
      pinned: 'left',
    },
    {
      field: 'assetClass',
      headerName: 'Class',
      width: 82,
      cellRenderer: AssetClassRenderer,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'direction',
      headerName: 'Side',
      width: 78,
      cellRenderer: DirectionRenderer,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'faceValueMM',
      headerName: 'Size',
      width: 78,
      type: 'numericColumn',
      cellClass: 'font-mono font-semibold',
      valueFormatter: p => p.data?.assetClass === 'Future' ? `${p.value} cts` : `$${p.value}MM`,
    },
    {
      field: 'avgPrice',
      headerName: 'Avg Px',
      width: 72,
      type: 'numericColumn',
      cellClass: 'font-mono text-muted-foreground',
      valueFormatter: p => fmtPrice(p.value),
    },
    {
      field: 'currentPrice',
      headerName: 'Curr Px',
      width: 72,
      type: 'numericColumn',
      cellClass: 'font-mono',
      valueFormatter: p => fmtPrice(p.value),
    },
    {
      field: 'currentYield',
      headerName: 'Curr Yld',
      width: 76,
      type: 'numericColumn',
      cellClass: 'font-mono text-muted-foreground',
      valueFormatter: p => p.value > 0 ? fmtYield(p.value) : '—',
    },
    {
      field: 'dv01',
      headerName: 'DV01',
      width: 76,
      type: 'numericColumn',
      cellClass: 'font-mono',
      valueFormatter: p => fmtDV01(p.value),
      cellStyle: p => ({ color: p.value >= 0 ? undefined : 'var(--color-sell)' }),
    },
    {
      field: 'cs01',
      headerName: 'CS01',
      width: 72,
      type: 'numericColumn',
      cellClass: 'font-mono text-muted-foreground',
      valueFormatter: p => p.value > 0 ? fmtDV01(p.value) : '—',
    },
    {
      field: 'pnlToday',
      headerName: 'P&L Today',
      width: 90,
      type: 'numericColumn',
      cellRenderer: PnlRenderer,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'pnlMtd',
      headerName: 'P&L MTD',
      width: 88,
      type: 'numericColumn',
      cellRenderer: PnlMutedRenderer,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'pnlYtd',
      headerName: 'P&L YTD',
      width: 88,
      type: 'numericColumn',
      cellRenderer: PnlMutedRenderer,
      filter: 'agNumberColumnFilter',
    },
  ], [])

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    minWidth: 50,
  }), [])

  const onRowClicked = useCallback((e: RowClickedEvent<Position>) => {
    setSelected(prev => prev?.id === e.data?.id ? null : (e.data ?? null))
  }, [])

  const onGridReady = useCallback((e: GridReadyEvent) => {
    e.api.sizeColumnsToFit()
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* KPI row */}
      <div className="grid grid-cols-6 gap-2 p-3 shrink-0">
        <KpiCard label="P&L Today"    value={fmtPnL(totalPnlToday)}              valueClass={totalPnlToday >= 0 ? 'text-buy' : 'text-sell'} />
        <KpiCard label="P&L MTD"      value={fmtPnL(totalPnlMtd)}                valueClass={totalPnlMtd   >= 0 ? 'text-buy' : 'text-sell'} />
        <KpiCard label="P&L YTD"      value={fmtPnL(totalPnlYtd)}                valueClass={totalPnlYtd   >= 0 ? 'text-buy' : 'text-sell'} />
        <KpiCard label="Net DV01"     value={fmtDV01(totalDV01)}                 sub="Rate sensitivity" />
        <KpiCard label="Net CS01"     value={fmtDV01(totalCS01)}                 sub="Credit sensitivity" />
        <KpiCard label="Market Value" value={'$' + totalMktVal.toFixed(1) + 'MM'} sub="Long positions" />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 flex gap-3 px-3 pb-3 overflow-hidden">

        {/* Positions grid */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Filter toolbar */}
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-1">
              {ASSET_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setAssetFilter(f)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                    assetFilter === f ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">{rowData.length} positions · All strategies</span>
          </div>
          <div className="flex-1 min-h-0">
            <AgGridReact<Position>
              theme={marketsUITheme}
              modules={[AllEnterpriseModule]}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              rowHeight={40}
              headerHeight={30}
              rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
              onRowClicked={onRowClicked}
              onGridReady={onGridReady}
              sideBar={{ toolPanels: ['columns', 'filters'], hiddenByDefault: true }}
              pinnedBottomRowData={[{
                id: 'total', security: 'TOTAL', assetClass: '', direction: '',
                faceValueMM: 0, avgPrice: 0, currentPrice: 0, currentYield: 0,
                dv01: totalDV01, cs01: totalCS01,
                pnlToday: totalPnlToday, pnlMtd: totalPnlMtd, pnlYtd: totalPnlYtd,
                cusip: '', marketValueMM: 0,
              } as unknown as Position]}
              suppressCellFocus
              enableCellTextSelection
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </div>

        {/* Right sidebar: DV01 chart + detail/attribution */}
        <div className="w-56 flex flex-col gap-3 shrink-0">
          <div className="bg-card border border-border rounded-xl overflow-hidden shrink-0">
            <div className="px-4 py-2.5 border-b border-border">
              <span className="text-xs font-semibold">DV01 by Class</span>
            </div>
            <div className="p-2 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DV01_BY_CLASS} layout="vertical" margin={{ top: 2, right: 12, left: 0, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'K'} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={56} />
                  <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11 }} formatter={(v: number) => ['$' + Math.abs(v).toLocaleString(), 'DV01']} />
                  <ReferenceLine x={0} stroke="var(--color-border)" />
                  <Bar dataKey="dv01" radius={[0, 3, 3, 0]}>
                    {DV01_BY_CLASS.map((d, i) => <Cell key={i} fill={d.dv01 >= 0 ? 'var(--color-buy)' : 'var(--color-sell)'} fillOpacity={0.7} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {selected ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden flex-1 min-h-0 flex flex-col">
              <div className="px-4 py-3 border-b border-border shrink-0">
                <div className="font-semibold text-sm">{selected.security}</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{selected.cusip}</div>
              </div>
              <div className={cn('mx-3 mt-3 px-3 py-2.5 rounded-lg shrink-0', selected.pnlToday >= 0 ? 'bg-buy/10' : 'bg-sell/10')}>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">P&L Today</div>
                <div className={cn('text-xl font-semibold font-mono', selected.pnlToday >= 0 ? 'text-buy' : 'text-sell')}>{fmtPnL(selected.pnlToday)}</div>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-[11px]">
                  {([
                    ['Side',    selected.direction],
                    ['Class',   selected.assetClass],
                    ['Size',    selected.assetClass === 'Future' ? `${selected.faceValueMM} cts` : `$${selected.faceValueMM}MM`],
                    ['Avg Px',  fmtPrice(selected.avgPrice)],
                    ['Curr Px', fmtPrice(selected.currentPrice)],
                    ['Yield',   selected.currentYield > 0 ? fmtYield(selected.currentYield) : '—'],
                    ['DV01',    fmtDV01(selected.dv01)],
                    ['CS01',    selected.cs01 > 0 ? fmtDV01(selected.cs01) : '—'],
                    ['MTD',     fmtPnL(selected.pnlMtd)],
                    ['YTD',     fmtPnL(selected.pnlYtd)],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">{k}</div>
                      <div className="font-mono font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden flex-1 min-h-0 flex flex-col">
              <div className="px-4 py-2.5 border-b border-border shrink-0">
                <span className="text-xs font-semibold">P&L Attribution</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {[...BASE_POSITIONS].sort((a, b) => b.pnlToday - a.pnlToday).map(p => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-2 text-[11px]">
                    <span className="text-muted-foreground truncate mr-2">{p.security}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-12 h-1 bg-secondary rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', p.pnlToday >= 0 ? 'bg-buy' : 'bg-sell')} style={{ width: Math.min(Math.abs(p.pnlToday) / 45000 * 100, 100) + '%' }} />
                      </div>
                      <span className={cn('font-mono font-semibold w-16 text-right', p.pnlToday >= 0 ? 'text-buy' : 'text-sell')}>{fmtPnL(p.pnlToday)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
