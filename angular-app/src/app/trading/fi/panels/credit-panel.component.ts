import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import { AgGridAngular } from 'ag-grid-angular'
import { AllEnterpriseModule, ModuleRegistry } from 'ag-grid-enterprise'
import type { ColDef } from 'ag-grid-community'
import { marketsUITheme } from '../ag-grid-theme'
import { MarketDataService, fmtYield, fmtPrice, type CorpBond, type CDXIndex, type CDS } from '../market-data.service'

ModuleRegistry.registerModules([AllEnterpriseModule])

type CreditTab = 'IG Bonds' | 'HY Bonds' | 'CDX / CDS'

const RATING_COLOR: Record<string, string> = {
  'Aaa': 'var(--ds-buy)', 'Aa2': 'var(--ds-buy)', 'Aa3': 'var(--ds-buy)', 'A1': 'var(--ds-buy)',
  'A2': 'var(--ds-buy)', 'A3': 'var(--ds-buy)',
  'Baa1': 'var(--ds-warning)', 'Baa2': 'var(--ds-warning)', 'Baa3': 'var(--ds-warning)',
  'Ba1': 'var(--ds-sell)', 'Ba2': 'var(--ds-sell)', 'Ba3': 'var(--ds-sell)',
  'B1': 'var(--ds-sell)', 'B2': 'var(--ds-sell)', 'B3': 'var(--ds-sell)',
}

@Component({
  selector: 'app-credit-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, AgGridAngular],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">

      <!-- CDX ticker strip -->
      <div class="ticker-strip">
        @for (idx of cdxIndices; track idx.name + idx.tenor; let i = $index) {
          <div class="ticker-item" [class.border-left]="i > 0">
            <span class="muted small">{{ idx.name }} {{ idx.tenor }}</span>
            <span class="mono semibold">{{ ((idx.bidSpread + idx.askSpread) / 2).toFixed(1) }}</span>
            <span class="small mono" [class.sell]="idx.change > 0" [class.buy]="idx.change <= 0">
              {{ idx.change > 0 ? '+' : '' }}{{ idx.change.toFixed(1) }}
            </span>
          </div>
        }
      </div>

      <!-- Sub-tab -->
      <div class="tab-bar">
        @for (t of tabs; track t) {
          <button class="tab-btn" [class.active]="tab === t" (click)="tab = t; cdr.markForCheck()">
            {{ t }}
            @if (t === 'IG Bonds') { <span class="tab-count muted">{{ igBonds.length }}</span> }
            @if (t === 'HY Bonds') { <span class="tab-count sell">{{ hyBonds.length }}</span> }
          </button>
        }
      </div>

      <!-- Grid area -->
      <div class="flex-1">
        @if (tab === 'IG Bonds') {
          <ag-grid-angular [theme]="theme" [rowData]="igBonds" [columnDefs]="bondColDefs" [defaultColDef]="defaultColDef" [rowHeight]="34" [headerHeight]="30" [rowSelection]="rowSel" [suppressCellFocus]="true" [enableCellTextSelection]="true" [sideBar]="sideBar" style="height:100%;width:100%" />
        }
        @if (tab === 'HY Bonds') {
          <ag-grid-angular [theme]="theme" [rowData]="hyBonds" [columnDefs]="bondColDefs" [defaultColDef]="defaultColDef" [rowHeight]="34" [headerHeight]="30" [rowSelection]="rowSel" [suppressCellFocus]="true" [enableCellTextSelection]="true" [sideBar]="sideBar" style="height:100%;width:100%" />
        }
        @if (tab === 'CDX / CDS') {
          <div class="cdx-cds-grid">
            <ag-grid-angular [theme]="theme" [rowData]="cdxIndices" [columnDefs]="cdxColDefs" [defaultColDef]="defaultColDef" [rowHeight]="32" [headerHeight]="30" [suppressCellFocus]="true" style="height:100%;width:100%" />
            <ag-grid-angular [theme]="theme" [rowData]="cdsNames" [columnDefs]="cdsColDefs" [defaultColDef]="defaultColDef" [rowHeight]="36" [headerHeight]="30" [suppressCellFocus]="true" style="height:100%;width:100%" />
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .panel { height: 100%; display: flex; flex-direction: column; padding: 0.75rem; gap: 0.75rem; overflow: hidden; }
    .flex-1 { flex: 1; min-height: 0; }

    .ticker-strip { display: flex; align-items: center; overflow-x: auto; border: 1px solid var(--ds-border); border-radius: 12px; background: var(--ds-card); padding: 0.375rem 0.5rem; flex-shrink: 0; }
    .ticker-item  { display: flex; align-items: center; gap: 0.5rem; padding: 0 0.75rem; flex-shrink: 0; }
    .border-left  { border-left: 1px solid var(--ds-border); }

    .tab-bar { display: flex; border-bottom: 1px solid var(--ds-border); flex-shrink: 0; }
    .tab-btn  { padding: 0.375rem 1rem; font-size: 0.75rem; font-weight: 500; background: none; border: none; border-bottom: 2px solid transparent; color: var(--ds-muted-foreground); cursor: pointer; transition: color 0.15s, border-color 0.15s; }
    .tab-btn.active { color: var(--ds-foreground); border-bottom-color: var(--ds-primary); }
    .tab-btn:hover  { color: var(--ds-foreground); }
    .tab-count { font-size: 9px; margin-left: 6px; }

    .cdx-cds-grid { height: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

    .muted  { color: var(--ds-muted-foreground); }
    .small  { font-size: 10px; }
    .mono   { font-family: var(--ds-font-mono); }
    .semibold { font-weight: 600; }
    .buy    { color: var(--ds-buy); }
    .sell   { color: var(--ds-sell); }
  `],
})
export class CreditPanelComponent implements OnInit, OnDestroy {
  readonly theme = marketsUITheme
  readonly rowSel = { mode: 'singleRow' as const, checkboxes: false, enableClickSelection: true }
  readonly tabs: CreditTab[] = ['IG Bonds', 'HY Bonds', 'CDX / CDS']
  readonly sideBar = { toolPanels: ['columns', 'filters'], hiddenByDefault: true }

  tab: CreditTab = 'IG Bonds'
  corpBonds: CorpBond[] = []
  cdxIndices: CDXIndex[] = []
  cdsNames: CDS[] = []
  igBonds: CorpBond[] = []
  hyBonds: CorpBond[] = []

  bondColDefs: ColDef<CorpBond>[] = [
    { field: 'issuer',      headerName: 'Issuer',   width: 130, cellClass: 'font-medium', filter: 'agTextColumnFilter' },
    { field: 'description', headerName: 'Security', flex: 1,    minWidth: 120, filter: 'agTextColumnFilter' },
    {
      colId: 'rating', headerName: 'Rating', width: 80,
      valueGetter: (p: any) => p.data?.ratingMoodys,
      cellRenderer: (p: any) => {
        const color = RATING_COLOR[p.data?.ratingMoodys ?? ''] ?? 'var(--ds-muted-foreground)'
        return `<span style="font-family:monospace;font-size:10px;color:${color}">${p.data?.ratingMoodys}/${p.data?.ratingSP}</span>`
      },
    },
    { field: 'sector',      headerName: 'Sector',   width: 88,  cellClass: 'text-muted-foreground text-xs', filter: 'agSetColumnFilter' },
    { field: 'bidYield',    headerName: 'Bid Yld',  width: 78,  type: 'numericColumn', cellClass: 'font-mono font-semibold', cellStyle: () => ({ color: 'var(--ds-buy)' }), valueFormatter: (p: any) => fmtYield(p.value) },
    { field: 'askYield',    headerName: 'Ask Yld',  width: 78,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-sell)' }), valueFormatter: (p: any) => fmtYield(p.value) },
    { field: 'bidPrice',    headerName: 'Bid Px',   width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => fmtPrice(p.value) },
    { field: 'zSpread',     headerName: 'Z-Spd',    width: 72,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-primary)' }), valueFormatter: (p: any) => p.value.toFixed(0) + ' bps' },
    { field: 'oas',         headerName: 'OAS',      width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => p.value.toFixed(0) + ' bps' },
    { field: 'change',      headerName: 'Chg',      width: 64,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: (p: any): any => ({ color: p.value < 0 ? 'var(--ds-buy)' : p.value > 0 ? 'var(--ds-sell)' : undefined }), valueFormatter: (p: any) => (p.value >= 0 ? '+' : '') + p.value.toFixed(1) },
    { field: 'modDuration', headerName: 'Dur',      width: 62,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => p.value.toFixed(2) },
    { field: 'dv01PerMM',   headerName: 'DV01/MM',  width: 80,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => '$' + p.value.toLocaleString() },
  ]

  cdxColDefs: ColDef<CDXIndex>[] = [
    { field: 'name',           headerName: 'Index',   flex: 1, minWidth: 100, cellClass: 'font-medium text-xs' },
    { field: 'series',         headerName: 'Series',  width: 60, type: 'numericColumn' },
    { field: 'tenor',          headerName: 'Tenor',   width: 56 },
    { field: 'bidSpread',      headerName: 'Bid',     width: 62, type: 'numericColumn', cellClass: 'font-mono font-semibold', cellStyle: () => ({ color: 'var(--ds-buy)' }), valueFormatter: (p: any) => p.value.toFixed(1) },
    { field: 'askSpread',      headerName: 'Ask',     width: 62, type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-sell)' }), valueFormatter: (p: any) => p.value.toFixed(1) },
    { field: 'change',         headerName: 'Chg',     width: 64, type: 'numericColumn', cellClass: 'font-mono', cellStyle: (p: any): any => ({ color: p.value < 0 ? 'var(--ds-buy)' : p.value > 0 ? 'var(--ds-sell)' : undefined }), valueFormatter: (p: any) => (p.value >= 0 ? '+' : '') + p.value.toFixed(2) },
    { field: 'spreadDuration', headerName: 'Spd Dur', width: 70, type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => p.value.toFixed(2) },
  ]

  cdsColDefs: ColDef<CDS>[] = [
    {
      colId: 'entity', headerName: 'Reference Entity', flex: 1, minWidth: 120,
      cellRenderer: (p: any) => `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;gap:2px"><div style="font-weight:500;font-size:11px">${p.data?.name}</div><div style="font-size:10px;color:var(--ds-muted-foreground);font-family:monospace">${p.data?.ticker}</div></div>`,
    },
    {
      colId: 'rating', headerName: 'Rating', width: 80,
      valueGetter: (p: any) => p.data?.ratingMoodys,
      cellRenderer: (p: any) => {
        const color = RATING_COLOR[p.data?.ratingMoodys ?? ''] ?? 'var(--ds-muted-foreground)'
        return `<span style="font-family:monospace;font-size:10px;color:${color}">${p.data?.ratingMoodys}/${p.data?.ratingSP}</span>`
      },
    },
    { field: 'sector', headerName: 'Sector', width: 88, filter: 'agSetColumnFilter' },
    { field: 'bid',    headerName: 'Bid',    width: 64, type: 'numericColumn', cellClass: 'font-mono font-semibold', cellStyle: () => ({ color: 'var(--ds-buy)' }), valueFormatter: (p: any) => p.value.toFixed(1) },
    { field: 'ask',    headerName: 'Ask',    width: 64, type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-sell)' }), valueFormatter: (p: any) => p.value.toFixed(1) },
    { field: 'change', headerName: 'Chg',    width: 64, type: 'numericColumn', cellClass: 'font-mono', cellStyle: (p: any): any => ({ color: p.value < 0 ? 'var(--ds-buy)' : p.value > 0 ? 'var(--ds-sell)' : undefined }), valueFormatter: (p: any) => (p.value >= 0 ? '+' : '') + p.value.toFixed(1) },
  ]

  defaultColDef: ColDef = { sortable: true, resizable: true, minWidth: 50 }

  private subs = new Subscription()
  constructor(private marketData: MarketDataService, public cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subs.add(this.marketData.corpBonds$.subscribe(b => {
      this.corpBonds = b; this.igBonds = b.filter(x => !x.isHY); this.hyBonds = b.filter(x => x.isHY)
      this.cdr.markForCheck()
    }))
    this.subs.add(this.marketData.cdxIndices$.subscribe(c => { this.cdxIndices = c; this.cdr.markForCheck() }))
    this.subs.add(this.marketData.cdsNames$.subscribe(c => { this.cdsNames = c; this.cdr.markForCheck() }))
  }

  ngOnDestroy(): void { this.subs.unsubscribe() }
}
