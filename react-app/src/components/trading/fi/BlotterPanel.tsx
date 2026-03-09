import { useMemo, useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllEnterpriseModule } from 'ag-grid-enterprise'
import type { ColDef, ICellRendererParams, RowClickedEvent, GridReadyEvent, StatusPanelDef } from 'ag-grid-community'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { BASE_ORDERS, type Order } from './marketData'
import { marketsUITheme } from './agGridTheme'
import { OrderTicket } from './OrderTicket'

// ── Cell renderers (defined outside component for stable references) ──────────

const SideRenderer = ({ value }: ICellRendererParams) => (
  <span className={cn(
    'text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide',
    value === 'Buy' ? 'bg-buy/15 text-buy' : 'bg-sell/15 text-sell',
  )}>
    {value === 'Buy' ? 'BUY' : 'SELL'}
  </span>
)

const StatusRenderer = ({ value }: ICellRendererParams) => {
  const cls: Record<string, string> = {
    Filled:    'bg-buy/15 text-buy border border-buy/20',
    Working:   'bg-primary/15 text-primary border border-primary/20',
    Partial:   'bg-warning/15 text-warning border border-warning/20',
    Cancelled: 'bg-muted text-muted-foreground border border-border',
  }
  return (
    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', cls[value] ?? 'bg-muted text-muted-foreground')}>
      {value}
    </span>
  )
}

const SecurityRenderer = ({ data }: ICellRendererParams<Order>) => (
  <div className="flex flex-col justify-center h-full leading-none gap-0.5">
    <div className="font-medium text-[11px]">{data?.security}</div>
    <div className="text-[10px] text-muted-foreground font-mono">{data?.cusip}</div>
  </div>
)

const FillBarRenderer = ({ data }: ICellRendererParams<Order>) => {
  const pct = (data?.faceValueMM ?? 0) > 0 ? ((data!.filledMM / data!.faceValueMM) * 100) : 0
  return (
    <div className="flex items-center gap-1.5 h-full">
      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full', pct >= 100 ? 'bg-buy' : pct > 0 ? 'bg-primary' : 'bg-muted')}
          style={{ width: pct + '%' }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">{pct.toFixed(0)}%</span>
    </div>
  )
}

// ── Status filter (above grid) ────────────────────────────────────────────────

type StatusFilter = 'All' | Order['status']
const STATUS_FILTERS: StatusFilter[] = ['All', 'Working', 'Partial', 'Filled', 'Cancelled']

// ── FillBar for detail panel ──────────────────────────────────────────────────

function FillBar({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? (filled / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', pct >= 100 ? 'bg-buy' : pct > 0 ? 'bg-primary' : 'bg-muted')} style={{ width: pct + '%' }} />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-8">{pct.toFixed(0)}%</span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BlotterPanel() {
  const [filter, setFilter] = useState<StatusFilter>('All')
  const [selected, setSelected] = useState<Order | null>(null)
  const [ticketOpen, setTicketOpen] = useState(false)

  const rowData = useMemo(() =>
    filter === 'All' ? BASE_ORDERS : BASE_ORDERS.filter(o => o.status === filter),
    [filter],
  )

  const counts = useMemo(() =>
    STATUS_FILTERS.slice(1).reduce((acc, s) => {
      acc[s] = BASE_ORDERS.filter(o => o.status === s).length
      return acc
    }, {} as Record<string, number>),
    [],
  )

  const colDefs = useMemo<ColDef<Order>[]>(() => [
    {
      field: 'id',
      headerName: 'Order ID',
      width: 90,
      cellClass: 'font-mono text-muted-foreground',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 68,
      cellClass: 'font-mono',
    },
    {
      field: 'security',
      headerName: 'Security',
      width: 160,
      cellRenderer: SecurityRenderer,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'side',
      headerName: 'Side',
      width: 72,
      cellRenderer: SideRenderer,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'faceValueMM',
      headerName: 'Size $MM',
      width: 80,
      type: 'numericColumn',
      cellClass: 'font-mono font-semibold',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'limitYield',
      headerName: 'Lmt Yield',
      width: 80,
      type: 'numericColumn',
      cellClass: 'font-mono text-muted-foreground',
      valueFormatter: p => p.value ? p.value.toFixed(3) + '%' : '—',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'limitPrice',
      headerName: 'Lmt Price',
      width: 78,
      type: 'numericColumn',
      cellClass: 'font-mono text-muted-foreground',
      valueFormatter: p => p.value ? p.value.toFixed(3) : '—',
    },
    {
      field: 'filledMM',
      headerName: 'Filled',
      width: 66,
      type: 'numericColumn',
      cellClass: 'font-mono',
      valueFormatter: p => p.value ?? '—',
    },
    {
      colId: 'fillPct',
      headerName: 'Fill %',
      width: 100,
      cellRenderer: FillBarRenderer,
      sortable: false,
      filter: false,
    },
    {
      field: 'avgFillYield',
      headerName: 'Avg Yield',
      width: 82,
      type: 'numericColumn',
      cellClass: 'font-mono',
      valueFormatter: p => p.value ? p.value.toFixed(3) + '%' : '—',
    },
    {
      field: 'venue',
      headerName: 'Venue',
      width: 100,
      cellClass: 'text-muted-foreground',
      filter: 'agSetColumnFilter',
    },
    {
      field: 'counterparty',
      headerName: 'Cpty',
      width: 110,
      cellClass: 'text-muted-foreground',
      filter: 'agSetColumnFilter',
    },
    {
      field: 'account',
      headerName: 'Account',
      width: 88,
      cellClass: 'text-muted-foreground',
      filter: 'agSetColumnFilter',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 90,
      cellRenderer: StatusRenderer,
      filter: 'agSetColumnFilter',
    },
  ], [])

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    suppressMovable: false,
    minWidth: 50,
  }), [])

  const statusBar = useMemo<{ statusPanels: StatusPanelDef[] }>(() => ({
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
      { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
    ],
  }), [])

  const onRowClicked = useCallback((e: RowClickedEvent<Order>) => {
    setSelected(prev => prev?.id === e.data?.id ? null : (e.data ?? null))
  }, [])

  const onGridReady = useCallback((e: GridReadyEvent) => {
    e.api.sizeColumnsToFit()
  }, [])

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main blotter */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-1">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  filter === s
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                )}
              >
                {s}
                {s !== 'All' && (counts[s] ?? 0) > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-60">{counts[s]}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">{rowData.length} orders · Today</span>
            <button
              onClick={() => setTicketOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              New Order
            </button>
          </div>
        </div>

        {/* AG Grid */}
        <div className="flex-1 min-h-0 p-3">
          <AgGridReact<Order>
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
            statusBar={statusBar}
            enableCellTextSelection
            suppressCellFocus
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>

      {/* Order detail sidebar */}
      {selected && (
        <div className="w-64 border-l border-border bg-card overflow-y-auto shrink-0 flex flex-col">
          <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-sm leading-tight">{selected.security}</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{selected.description}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground mt-0.5 ml-2 text-base leading-none shrink-0">×</button>
            </div>
          </div>
          <div className="flex-1 px-3 py-3 space-y-3 text-[11px] overflow-y-auto">
            <div className={cn('px-3 py-2.5 rounded-lg', selected.side === 'Buy' ? 'bg-buy/10' : 'bg-sell/10')}>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">
                {selected.side === 'Buy' ? 'Buy Order' : 'Sell Order'}
              </div>
              <div className={cn('text-xl font-semibold font-mono', selected.side === 'Buy' ? 'text-buy' : 'text-sell')}>
                ${selected.faceValueMM}MM
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
              {([['CUSIP', selected.cusip], ['Side', selected.side], ['Time', selected.time], ['Account', selected.account]] as [string, string][]).map(([k, v]) => (
                <div key={k}>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">{k}</div>
                  <div className={cn('font-mono font-medium', k === 'Side' && (v === 'Buy' ? 'text-buy' : 'text-sell'))}>{v}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Execution</div>
              {([
                ['Limit Yield', selected.limitYield ? selected.limitYield.toFixed(3) + '%' : '—'],
                ['Limit Price', selected.limitPrice ? selected.limitPrice.toFixed(3) : '—'],
                ['Filled',      selected.filledMM + 'MM'],
                ['Avg Yield',   selected.avgFillYield ? selected.avgFillYield.toFixed(3) + '%' : '—'],
                ['Avg Price',   selected.avgFillPrice ? selected.avgFillPrice.toFixed(3) : '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono">{v}</span>
                </div>
              ))}
              <div className="pt-1"><FillBar filled={selected.filledMM} total={selected.faceValueMM} /></div>
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Settlement</div>
              {([
                ['Counterparty', selected.counterparty],
                ['Venue',        selected.venue],
                ['Trader',       selected.trader],
                ['Settle',       selected.cusip.startsWith('CME') ? 'T+1' : 'T+3'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <OrderTicket open={ticketOpen} onClose={() => setTicketOpen(false)} />
    </div>
  )
}
