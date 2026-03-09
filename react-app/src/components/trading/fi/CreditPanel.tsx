import { useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllEnterpriseModule } from 'ag-grid-enterprise'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { cn } from '@/lib/utils'
import type { CorpBond, CDXIndex, CDS } from './marketData'
import { fmtYield, fmtPrice } from './marketData'
import { marketsUITheme } from './agGridTheme'

interface Props {
  corpBonds: CorpBond[]
  cdxIndices: CDXIndex[]
  cdsNames: CDS[]
}

type CreditTab = 'IG Bonds' | 'HY Bonds' | 'CDX / CDS'

const RATING_COLOR: Record<string, string> = {
  'Aaa': 'var(--color-buy)', 'Aa2': 'var(--color-buy)', 'Aa3': 'var(--color-buy)', 'A1': 'var(--color-buy)',
  'A2': 'var(--color-buy)', 'A3': 'var(--color-buy)',
  'Baa1': 'var(--color-warning)', 'Baa2': 'var(--color-warning)', 'Baa3': 'var(--color-warning)',
  'Ba1': 'var(--color-sell)', 'Ba2': 'var(--color-sell)', 'Ba3': 'var(--color-sell)',
  'B1': 'var(--color-sell)', 'B2': 'var(--color-sell)', 'B3': 'var(--color-sell)',
}

// ── Cell renderers ─────────────────────────────────────────────────────────────

const RatingRenderer = ({ data }: ICellRendererParams<CorpBond>) => (
  <span className="font-mono text-[10px]" style={{ color: RATING_COLOR[data?.ratingMoodys ?? ''] ?? 'var(--color-muted-foreground)' }}>
    {data?.ratingMoodys}/{data?.ratingSP}
  </span>
)

const CdsBondIssuerRenderer = ({ data }: ICellRendererParams<CDS>) => (
  <div className="flex flex-col justify-center h-full leading-none gap-0.5">
    <div className="font-medium text-[11px]">{data?.name}</div>
    <div className="text-[10px] text-muted-foreground font-mono">{data?.ticker}</div>
  </div>
)

const CdsRatingRenderer = ({ data }: ICellRendererParams<CDS>) => (
  <span className="font-mono text-[10px]" style={{ color: RATING_COLOR[data?.ratingMoodys ?? ''] ?? 'var(--color-muted-foreground)' }}>
    {data?.ratingMoodys}/{data?.ratingSP}
  </span>
)

function chgStyle(value: number) {
  return { color: value < 0 ? 'var(--color-buy)' : value > 0 ? 'var(--color-sell)' : undefined }
}

// ── Bond grid ─────────────────────────────────────────────────────────────────

function BondGrid({ bonds }: { bonds: CorpBond[] }) {
  const colDefs = useMemo<ColDef<CorpBond>[]>(() => [
    { field: 'issuer',      headerName: 'Issuer',   width: 130, cellClass: 'font-medium', filter: 'agTextColumnFilter' },
    { field: 'description', headerName: 'Security', flex: 1,    cellClass: 'text-muted-foreground', minWidth: 120, filter: 'agTextColumnFilter' },
    { colId: 'rating',      headerName: 'Rating',   width: 80,  cellRenderer: RatingRenderer, filter: 'agSetColumnFilter', valueGetter: p => p.data?.ratingMoodys },
    { field: 'sector',      headerName: 'Sector',   width: 88,  cellClass: 'text-muted-foreground text-[10px]', filter: 'agSetColumnFilter' },
    { field: 'bidYield',    headerName: 'Bid Yld',  width: 78,  type: 'numericColumn', cellClass: 'font-mono font-semibold text-buy', valueFormatter: p => fmtYield(p.value) },
    { field: 'askYield',    headerName: 'Ask Yld',  width: 78,  type: 'numericColumn', cellClass: 'font-mono text-sell', valueFormatter: p => fmtYield(p.value) },
    { field: 'bidPrice',    headerName: 'Bid Px',   width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => fmtPrice(p.value) },
    { field: 'zSpread',     headerName: 'Z-Spd',    width: 72,  type: 'numericColumn', cellClass: 'font-mono text-primary', valueFormatter: p => p.value.toFixed(0) + ' bps' },
    { field: 'oas',         headerName: 'OAS',      width: 72,  type: 'numericColumn', cellClass: 'font-mono text-muted-foreground', valueFormatter: p => p.value.toFixed(0) + ' bps' },
    {
      field: 'change', headerName: 'Chg', width: 64, type: 'numericColumn', cellClass: 'font-mono',
      cellStyle: p => chgStyle(p.value),
      valueFormatter: p => (p.value >= 0 ? '+' : '') + p.value.toFixed(1),
    },
    { field: 'modDuration', headerName: 'Dur',      width: 62,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => p.value.toFixed(2) },
    { field: 'dv01PerMM',   headerName: 'DV01/MM',  width: 80,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => '$' + p.value.toLocaleString() },
  ], [])

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true, minWidth: 50 }), [])

  return (
    <AgGridReact<CorpBond>
      theme={marketsUITheme}
      modules={[AllEnterpriseModule]}
      rowData={bonds}
      columnDefs={colDefs}
      defaultColDef={defaultColDef}
      rowHeight={34}
      headerHeight={30}
      rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
      sideBar={{ toolPanels: ['columns', 'filters'], hiddenByDefault: true }}
      suppressCellFocus
      enableCellTextSelection
      style={{ height: '100%', width: '100%' }}
    />
  )
}

// ── CDX grid ──────────────────────────────────────────────────────────────────

function CdxGrid({ cdxIndices }: { cdxIndices: CDXIndex[] }) {
  const colDefs = useMemo<ColDef<CDXIndex>[]>(() => [
    { field: 'name',           headerName: 'Index',    flex: 1, minWidth: 100, cellClass: 'font-medium text-[10px]' },
    { field: 'series',         headerName: 'Series',   width: 60, type: 'numericColumn', cellClass: 'font-mono text-muted-foreground' },
    { field: 'tenor',          headerName: 'Tenor',    width: 56, cellClass: 'font-mono text-muted-foreground' },
    { field: 'bidSpread',      headerName: 'Bid',      width: 62, type: 'numericColumn', cellClass: 'font-mono font-semibold text-buy', valueFormatter: p => p.value.toFixed(1) },
    { field: 'askSpread',      headerName: 'Ask',      width: 62, type: 'numericColumn', cellClass: 'font-mono text-sell', valueFormatter: p => p.value.toFixed(1) },
    {
      field: 'change', headerName: 'Chg', width: 64, type: 'numericColumn', cellClass: 'font-mono',
      cellStyle: p => chgStyle(p.value),
      valueFormatter: p => (p.value >= 0 ? '+' : '') + p.value.toFixed(2),
    },
    { field: 'spreadDuration', headerName: 'Spd Dur',  width: 70, type: 'numericColumn', cellClass: 'font-mono', valueFormatter: p => p.value.toFixed(2) },
  ], [])

  return (
    <AgGridReact<CDXIndex>
      theme={marketsUITheme}
      modules={[AllEnterpriseModule]}
      rowData={cdxIndices}
      columnDefs={colDefs}
      defaultColDef={{ sortable: true, resizable: true }}
      rowHeight={32}
      headerHeight={30}
      suppressCellFocus
      style={{ height: '100%', width: '100%' }}
    />
  )
}

// ── Single-name CDS grid ──────────────────────────────────────────────────────

function CdsGrid({ cdsNames }: { cdsNames: CDS[] }) {
  const colDefs = useMemo<ColDef<CDS>[]>(() => [
    { colId: 'entity',      headerName: 'Reference Entity', flex: 1, minWidth: 120, cellRenderer: CdsBondIssuerRenderer },
    { colId: 'rating',      headerName: 'Rating',  width: 80, cellRenderer: CdsRatingRenderer, valueGetter: p => p.data?.ratingMoodys },
    { field: 'sector',      headerName: 'Sector',  width: 88, cellClass: 'text-muted-foreground text-[10px]', filter: 'agSetColumnFilter' },
    { field: 'bid',         headerName: 'Bid',     width: 64, type: 'numericColumn', cellClass: 'font-mono font-semibold text-buy', valueFormatter: p => p.value.toFixed(1) },
    { field: 'ask',         headerName: 'Ask',     width: 64, type: 'numericColumn', cellClass: 'font-mono text-sell', valueFormatter: p => p.value.toFixed(1) },
    {
      field: 'change', headerName: 'Chg', width: 64, type: 'numericColumn', cellClass: 'font-mono',
      cellStyle: p => chgStyle(p.value),
      valueFormatter: p => (p.value >= 0 ? '+' : '') + p.value.toFixed(1),
    },
  ], [])

  return (
    <AgGridReact<CDS>
      theme={marketsUITheme}
      modules={[AllEnterpriseModule]}
      rowData={cdsNames}
      columnDefs={colDefs}
      defaultColDef={{ sortable: true, resizable: true }}
      rowHeight={36}
      headerHeight={30}
      suppressCellFocus
      style={{ height: '100%', width: '100%' }}
    />
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function CreditPanel({ corpBonds, cdxIndices, cdsNames }: Props) {
  const [tab, setTab] = useState<CreditTab>('IG Bonds')
  const igBonds = corpBonds.filter(b => !b.isHY)
  const hyBonds = corpBonds.filter(b =>  b.isHY)

  return (
    <div className="h-full flex flex-col overflow-hidden p-3 gap-3">
      {/* CDX ticker strip */}
      <div className="flex items-center gap-0 overflow-x-auto border border-border rounded-xl bg-card px-2 py-1.5 shrink-0">
        {cdxIndices.map((idx, i) => (
          <div key={i} className={cn('flex items-center gap-2 px-3 shrink-0', i > 0 && 'border-l border-border')}>
            <span className="text-[10px] text-muted-foreground">{idx.name} {idx.tenor}</span>
            <span className="text-xs font-mono font-semibold">{((idx.bidSpread + idx.askSpread) / 2).toFixed(1)}</span>
            <span className={cn('text-[10px] font-mono', idx.change > 0 ? 'text-sell' : 'text-buy')}>
              {idx.change > 0 ? '+' : ''}{idx.change.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Sub-tab switcher */}
      <div className="flex border-b border-border shrink-0">
        {(['IG Bonds', 'HY Bonds', 'CDX / CDS'] as CreditTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-1.5 text-xs font-medium border-b-2 transition-colors',
              tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t}
            {t === 'IG Bonds' && <span className="ml-1.5 text-[9px] text-muted-foreground">{igBonds.length}</span>}
            {t === 'HY Bonds' && <span className="ml-1.5 text-[9px] text-sell">{hyBonds.length}</span>}
          </button>
        ))}
      </div>

      {/* Grid area */}
      <div className="flex-1 min-h-0">
        {(tab === 'IG Bonds' || tab === 'HY Bonds') && (
          <BondGrid bonds={tab === 'IG Bonds' ? igBonds : hyBonds} />
        )}
        {tab === 'CDX / CDS' && (
          <div className="h-full grid grid-cols-2 gap-3">
            <CdxGrid cdxIndices={cdxIndices} />
            <CdsGrid cdsNames={cdsNames} />
          </div>
        )}
      </div>
    </div>
  )
}
