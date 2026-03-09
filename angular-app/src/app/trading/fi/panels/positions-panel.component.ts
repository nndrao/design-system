import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AgGridAngular } from 'ag-grid-angular'
import { AllEnterpriseModule, ModuleRegistry } from 'ag-grid-enterprise'
import type { ColDef, RowClickedEvent, GridReadyEvent } from 'ag-grid-community'
import { ChartModule } from 'primeng/chart'
import { marketsUITheme } from '../ag-grid-theme'
import { BASE_POSITIONS, fmtPnL, fmtDV01, fmtPrice, fmtYield, type Position } from '../market-data.service'

ModuleRegistry.registerModules([AllEnterpriseModule])

type AssetFilter = 'All' | 'Treasury' | 'Corporate' | 'Future' | 'CDS'
const ASSET_FILTERS: AssetFilter[] = ['All', 'Treasury', 'Corporate', 'Future', 'CDS']

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

@Component({
  selector: 'app-positions-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, AgGridAngular, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">

      <!-- KPI row -->
      <div class="kpi-row">
        <div class="kpi-card"><span class="kpi-label">P&amp;L Today</span><span class="kpi-value" [class.buy]="totalPnlToday >= 0" [class.sell]="totalPnlToday < 0">{{ fmtPnL(totalPnlToday) }}</span></div>
        <div class="kpi-card"><span class="kpi-label">P&amp;L MTD</span><span class="kpi-value" [class.buy]="totalPnlMtd >= 0" [class.sell]="totalPnlMtd < 0">{{ fmtPnL(totalPnlMtd) }}</span></div>
        <div class="kpi-card"><span class="kpi-label">P&amp;L YTD</span><span class="kpi-value" [class.buy]="totalPnlYtd >= 0" [class.sell]="totalPnlYtd < 0">{{ fmtPnL(totalPnlYtd) }}</span></div>
        <div class="kpi-card"><span class="kpi-label">Net DV01</span><span class="kpi-value">{{ fmtDV01(totalDV01) }}</span><span class="kpi-sub">Rate sensitivity</span></div>
        <div class="kpi-card"><span class="kpi-label">Net CS01</span><span class="kpi-value">{{ fmtDV01(totalCS01) }}</span><span class="kpi-sub">Credit sensitivity</span></div>
        <div class="kpi-card"><span class="kpi-label">Market Value</span><span class="kpi-value">{{ '$' + totalMktVal.toFixed(1) + 'MM' }}</span><span class="kpi-sub">Long positions</span></div>
      </div>

      <!-- Main content -->
      <div class="main-content">

        <!-- Grid -->
        <div class="grid-col">
          <div class="filter-bar">
            <div class="filter-btns">
              @for (f of assetFilters; track f) {
                <button class="filter-btn" [class.active]="assetFilter === f" (click)="setFilter(f)">{{ f }}</button>
              }
            </div>
            <span class="muted small">{{ rowData.length }} positions · All strategies</span>
          </div>
          <div class="flex-1">
            <ag-grid-angular
              [theme]="theme" [rowData]="rowData" [columnDefs]="colDefs" [defaultColDef]="defaultColDef"
              [rowHeight]="40" [headerHeight]="30" [rowSelection]="rowSel" (rowClicked)="onRowClicked($event)"
              (gridReady)="onGridReady($event)" [suppressCellFocus]="true" [enableCellTextSelection]="true"
              [pinnedBottomRowData]="pinnedRow" [sideBar]="sideBar" style="height:100%;width:100%"
            />
          </div>
        </div>

        <!-- Right sidebar -->
        <div class="sidebar">

          <!-- DV01 chart -->
          <div class="card shrink-0">
            <div class="card-header"><span class="card-title">DV01 by Class</span></div>
            <div style="height:9rem;padding:0.5rem">
              <p-chart type="bar" [data]="dv01ChartData" [options]="dv01ChartOpts" height="100%" width="100%" />
            </div>
          </div>

          <!-- Detail or Attribution -->
          <div class="card flex-1">
            @if (selected) {
              <div class="card-header">
                <div>
                  <div class="card-title">{{ selected.security }}</div>
                  <div class="card-subtitle">{{ selected.cusip }}</div>
                </div>
              </div>
              <div class="pnl-box" [class.buy-box]="selected.pnlToday >= 0" [class.sell-box]="selected.pnlToday < 0">
                <div class="pnl-label">P&amp;L Today</div>
                <div class="pnl-value" [class.buy]="selected.pnlToday >= 0" [class.sell]="selected.pnlToday < 0">{{ fmtPnL(selected.pnlToday) }}</div>
              </div>
              <div class="detail-grid">
                @for (row of detailRows; track row[0]) {
                  <div class="detail-field">
                    <div class="detail-label">{{ row[0] }}</div>
                    <div class="detail-val mono">{{ row[1] }}</div>
                  </div>
                }
              </div>
            } @else {
              <div class="card-header"><span class="card-title">P&amp;L Attribution</span></div>
              <div class="attrib-list">
                @for (p of sortedPositions; track p.id) {
                  <div class="attrib-row">
                    <span class="muted truncate">{{ p.security }}</span>
                    <div class="attrib-right">
                      <div class="attrib-bar">
                        <div class="attrib-fill" [class.buy-fill]="p.pnlToday >= 0" [class.sell-fill]="p.pnlToday < 0" [style.width.%]="barPct(p.pnlToday)"></div>
                      </div>
                      <span class="mono semibold w16" [class.buy]="p.pnlToday >= 0" [class.sell]="p.pnlToday < 0">{{ fmtPnL(p.pnlToday) }}</span>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .panel { height: 100%; display: flex; flex-direction: column; overflow: hidden; }
    .flex-1 { flex: 1; min-height: 0; }

    .kpi-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; padding: 0.75rem; flex-shrink: 0; }
    .kpi-card { background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 12px; padding: 0.75rem 1rem; display: flex; flex-direction: column; gap: 2px; }
    .kpi-label { font-size: 10px; color: var(--ds-muted-foreground); text-transform: uppercase; letter-spacing: 0.08em; }
    .kpi-value { font-size: 1.1rem; font-weight: 600; font-family: var(--ds-font-mono); line-height: 1.2; }
    .kpi-sub   { font-size: 10px; color: var(--ds-muted-foreground); }

    .main-content { flex: 1; min-height: 0; display: flex; gap: 0.75rem; padding: 0 0.75rem 0.75rem; overflow: hidden; }
    .grid-col { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
    .filter-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-shrink: 0; }
    .filter-btns { display: flex; gap: 4px; }
    .filter-btn { padding: 0.25rem 0.625rem; border-radius: 6px; font-size: 0.75rem; font-weight: 500; background: none; border: none; color: var(--ds-muted-foreground); cursor: pointer; }
    .filter-btn.active { background: var(--ds-accent); color: var(--ds-foreground); }

    .sidebar { width: 14rem; display: flex; flex-direction: column; gap: 0.75rem; flex-shrink: 0; overflow: hidden; }
    .card { background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
    .shrink-0 { flex-shrink: 0; }
    .card-header { padding: 0.625rem 1rem; border-bottom: 1px solid var(--ds-border); flex-shrink: 0; }
    .card-title { font-size: 0.75rem; font-weight: 600; }
    .card-subtitle { font-size: 10px; color: var(--ds-muted-foreground); font-family: var(--ds-font-mono); }

    .pnl-box { margin: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 8px; flex-shrink: 0; }
    .buy-box  { background: rgba(0,163,108,0.1); }
    .sell-box { background: rgba(207,32,47,0.1); }
    .pnl-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ds-muted-foreground); margin-bottom: 2px; }
    .pnl-value { font-size: 1.2rem; font-weight: 600; font-family: var(--ds-font-mono); }

    .detail-grid { padding: 0.75rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 0.5rem; flex: 1; overflow-y: auto; }
    .detail-field .detail-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ds-muted-foreground); margin-bottom: 2px; }
    .detail-field .detail-val { font-weight: 500; }

    .attrib-list { flex: 1; overflow-y: auto; }
    .attrib-row { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; font-size: 11px; border-bottom: 1px solid var(--ds-border); }
    .attrib-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
    .attrib-bar { width: 3rem; height: 4px; background: var(--ds-secondary); border-radius: 9999px; overflow: hidden; }
    .attrib-fill { height: 100%; border-radius: 9999px; }
    .buy-fill { background: var(--ds-buy); }
    .sell-fill { background: var(--ds-sell); }
    .w16 { width: 4rem; text-align: right; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 5rem; }

    .muted { color: var(--ds-muted-foreground); }
    .small { font-size: 10px; }
    .mono  { font-family: var(--ds-font-mono); }
    .semibold { font-weight: 600; }
    .buy  { color: var(--ds-buy); }
    .sell { color: var(--ds-sell); }
  `],
})
export class PositionsPanelComponent implements OnInit {
  readonly theme = marketsUITheme
  readonly rowSel = { mode: 'singleRow' as const, checkboxes: false, enableClickSelection: true }
  readonly assetFilters = ASSET_FILTERS
  readonly sideBar = { toolPanels: ['columns', 'filters'], hiddenByDefault: true }
  readonly fmtPnL = fmtPnL
  readonly fmtDV01 = fmtDV01
  readonly totalPnlToday = totalPnlToday
  readonly totalPnlMtd = totalPnlMtd
  readonly totalPnlYtd = totalPnlYtd
  readonly totalDV01 = totalDV01
  readonly totalCS01 = totalCS01
  readonly totalMktVal = totalMktVal
  readonly sortedPositions = [...BASE_POSITIONS].sort((a, b) => b.pnlToday - a.pnlToday)

  assetFilter: AssetFilter = 'All'
  rowData: Position[] = BASE_POSITIONS
  selected: Position | null = null
  detailRows: [string, string][] = []
  dv01ChartData: any = {}
  dv01ChartOpts: any = {}
  pinnedRow: any[] = [{
    security: 'TOTAL', dv01: totalDV01, cs01: totalCS01,
    pnlToday: totalPnlToday, pnlMtd: totalPnlMtd, pnlYtd: totalPnlYtd,
  }]

  colDefs: ColDef<Position>[] = [
    { field: 'security', headerName: 'Security', width: 160, pinned: 'left', filter: 'agTextColumnFilter',
      cellRenderer: (p: any) => `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;gap:2px"><div style="font-weight:600;font-size:11px">${p.data?.security}</div><div style="font-size:10px;color:var(--ds-muted-foreground);font-family:monospace">${p.data?.cusip}</div></div>` },
    { field: 'assetClass', headerName: 'Class', width: 82, filter: 'agSetColumnFilter',
      cellStyle: (p: any) => ({ color: { Treasury: 'var(--ds-primary)', Corporate: 'var(--ds-buy)', Future: 'var(--ds-warning)', CDS: 'var(--ds-sell)' }[p.value as string] ?? 'var(--ds-muted-foreground)', fontSize: '10px', fontWeight: 500 }) },
    { field: 'direction', headerName: 'Side', width: 78, filter: 'agSetColumnFilter',
      cellRenderer: (p: any) => `<span style="font-size:10px;padding:2px 8px;border-radius:9999px;font-weight:600;background:${p.value === 'Long' ? 'rgba(0,163,108,0.15)' : 'rgba(207,32,47,0.15)'};color:${p.value === 'Long' ? 'var(--ds-buy)' : 'var(--ds-sell)'}">${p.value === 'Long' ? 'LONG' : 'SHORT'}</span>` },
    { field: 'faceValueMM', headerName: 'Size', width: 78, type: 'numericColumn', cellClass: 'font-mono font-semibold', valueFormatter: (p: any) => p.data?.assetClass === 'Future' ? `${p.value} cts` : `$${p.value}MM` },
    { field: 'avgPrice',    headerName: 'Avg Px',   width: 72, type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }), valueFormatter: (p: any) => fmtPrice(p.value) },
    { field: 'currentPrice',headerName: 'Curr Px',  width: 72, type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => fmtPrice(p.value) },
    { field: 'currentYield',headerName: 'Curr Yld', width: 76, type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }), valueFormatter: (p: any) => p.value > 0 ? fmtYield(p.value) : '—' },
    { field: 'dv01', headerName: 'DV01', width: 76, type: 'numericColumn', cellClass: 'font-mono', cellStyle: (p: any): any => ({ color: p.value >= 0 ? undefined : 'var(--ds-sell)' }), valueFormatter: (p: any) => fmtDV01(p.value) },
    { field: 'cs01', headerName: 'CS01', width: 72, type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }), valueFormatter: (p: any) => p.value > 0 ? fmtDV01(p.value) : '—' },
    { field: 'pnlToday', headerName: 'P&L Today', width: 90, type: 'numericColumn', filter: 'agNumberColumnFilter',
      cellStyle: (p: any) => ({ color: p.value >= 0 ? 'var(--ds-buy)' : 'var(--ds-sell)', fontFamily: 'monospace', fontWeight: 600 }), valueFormatter: (p: any) => fmtPnL(p.value) },
    { field: 'pnlMtd', headerName: 'P&L MTD', width: 88, type: 'numericColumn', filter: 'agNumberColumnFilter',
      cellStyle: (p: any) => ({ color: p.value >= 0 ? 'var(--ds-buy)' : 'var(--ds-sell)', fontFamily: 'monospace' }), valueFormatter: (p: any) => fmtPnL(p.value) },
    { field: 'pnlYtd', headerName: 'P&L YTD', width: 88, type: 'numericColumn', filter: 'agNumberColumnFilter',
      cellStyle: (p: any) => ({ color: p.value >= 0 ? 'var(--ds-buy)' : 'var(--ds-sell)', fontFamily: 'monospace' }), valueFormatter: (p: any) => fmtPnL(p.value) },
  ]

  defaultColDef: ColDef = { sortable: true, resizable: true, minWidth: 50 }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buildDv01Chart()
    this.buildDv01ChartOpts()
  }

  setFilter(f: AssetFilter): void {
    this.assetFilter = f
    this.rowData = f === 'All' ? BASE_POSITIONS : BASE_POSITIONS.filter(p => p.assetClass === f)
    this.cdr.markForCheck()
  }

  onRowClicked(e: RowClickedEvent<Position>): void {
    this.selected = this.selected?.id === e.data?.id ? null : (e.data ?? null)
    if (this.selected) this.buildDetailRows(this.selected)
    this.cdr.markForCheck()
  }

  onGridReady(e: GridReadyEvent): void { e.api.sizeColumnsToFit() }

  private buildDetailRows(p: Position): void {
    this.detailRows = [
      ['Side',    p.direction],
      ['Class',   p.assetClass],
      ['Size',    p.assetClass === 'Future' ? `${p.faceValueMM} cts` : `$${p.faceValueMM}MM`],
      ['Avg Px',  fmtPrice(p.avgPrice)],
      ['Curr Px', fmtPrice(p.currentPrice)],
      ['Yield',   p.currentYield > 0 ? fmtYield(p.currentYield) : '—'],
      ['DV01',    fmtDV01(p.dv01)],
      ['CS01',    p.cs01 > 0 ? fmtDV01(p.cs01) : '—'],
      ['MTD',     fmtPnL(p.pnlMtd)],
      ['YTD',     fmtPnL(p.pnlYtd)],
    ]
  }

  private buildDv01Chart(): void {
    this.dv01ChartData = {
      labels: DV01_BY_CLASS.map(d => d.label),
      datasets: [{
        label: 'DV01',
        data: DV01_BY_CLASS.map(d => d.dv01),
        backgroundColor: DV01_BY_CLASS.map(d => d.dv01 >= 0 ? 'rgba(0,163,108,0.7)' : 'rgba(207,32,47,0.7)'),
        borderRadius: 3,
        indexAxis: 'y' as any,
      }],
    }
  }

  private buildDv01ChartOpts(): void {
    this.dv01ChartOpts = {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => '$' + Math.abs(ctx.parsed.x).toLocaleString() + ' DV01' } } },
      scales: {
        x: { ticks: { font: { size: 9 }, color: 'var(--ds-muted-foreground)', callback: (v: number) => '$' + (v / 1000).toFixed(0) + 'K' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { font: { size: 10 }, color: 'var(--ds-muted-foreground)' }, grid: { display: false } },
      },
    }
  }

  barPct(pnl: number): number { return Math.min(Math.abs(pnl) / 45000 * 100, 100) }
}
