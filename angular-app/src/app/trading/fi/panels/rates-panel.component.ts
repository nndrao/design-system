import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import { AgGridAngular } from 'ag-grid-angular'
import { AllEnterpriseModule, ModuleRegistry } from 'ag-grid-enterprise'
import type { ColDef, RowClickedEvent } from 'ag-grid-community'
import { ChartModule } from 'primeng/chart'
import { marketsUITheme } from '../ag-grid-theme'
import { MarketDataService, fmtYield, fmtPrice, type Treasury, type YieldCurvePoint } from '../market-data.service'

ModuleRegistry.registerModules([AllEnterpriseModule])

const CURVE_SPREADS = [
  { label: '2s5s',    tenors: ['2Y', '5Y'],         isFly: false },
  { label: '5s10s',   tenors: ['5Y', '10Y'],         isFly: false },
  { label: '2s10s',   tenors: ['2Y', '10Y'],         isFly: false },
  { label: '5s30s',   tenors: ['5Y', '30Y'],         isFly: false },
  { label: '2s5s10s', tenors: ['2Y', '5Y', '10Y'],  isFly: true  },
  { label: '5s10s30s',tenors: ['5Y', '10Y', '30Y'], isFly: true  },
]

@Component({
  selector: 'app-rates-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, AgGridAngular, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">
      <div class="main-area">

        <!-- Treasury Grid -->
        <div class="grid-col">
          <div class="grid-header">
            <div>
              <span class="card-title">On-The-Run US Treasuries</span>
              <span class="card-subtitle">Settlement T+1</span>
            </div>
            <span class="card-subtitle">Bid/Ask yields · Clean prices</span>
          </div>
          <div class="flex-1 min-h-0">
            <ag-grid-angular
              [theme]="theme"
              [rowData]="treasuries"
              [columnDefs]="colDefs"
              [defaultColDef]="defaultColDef"
              [rowHeight]="34"
              [headerHeight]="30"
              [rowSelection]="rowSel"
              (rowClicked)="onRowClicked($event)"
              [suppressCellFocus]="true"
              [enableCellTextSelection]="true"
              style="height:100%;width:100%"
            />
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="sidebar">

          <!-- Yield Curve -->
          <div class="card shrink-0">
            <div class="card-header">
              <span class="card-title">Yield Curve</span>
              <div class="legend-row">
                <span class="legend-item"><span class="leg-line primary"></span> Today</span>
                <span class="legend-item"><span class="leg-line muted"></span> Prior</span>
              </div>
            </div>
            <div style="height:9rem; padding:0.5rem">
              <p-chart type="line" [data]="yieldChartData" [options]="yieldChartOpts" height="100%" width="100%" />
            </div>
          </div>

          <!-- Curve Spreads -->
          <div class="card shrink-0">
            <div class="card-header">
              <span class="card-title">Curve Spreads</span>
              <span class="card-subtitle">bps</span>
            </div>
            <div class="spreads-grid">
              @for (s of curveSpreads; track s.label; let i = $index) {
                <div class="spread-cell" [class.border-right]="i % 2 === 0" [class.border-bottom]="i < curveSpreads.length - 2">
                  <span class="spread-label">{{ s.label }}</span>
                  <span class="spread-val" [class.buy]="s.val !== null && s.val < 0" [class.sell]="s.val !== null && s.val >= 0">
                    {{ s.val !== null ? (s.val > 0 ? '+' : '') + s.val.toFixed(1) : '—' }}
                  </span>
                </div>
              }
            </div>
          </div>

          <!-- Detail / KRD -->
          <div class="card flex-1">
            @if (selectedT) {
              <div class="card-header">
                <span class="card-title">CUSIP Detail · {{ selectedT.tenor }}</span>
                <button class="close-btn" (click)="selectedT = null">×</button>
              </div>
              <div class="detail-list">
                @for (row of detailRows; track row[0]) {
                  <div class="detail-row">
                    <span class="muted">{{ row[0] }}</span>
                    <span class="mono">{{ row[1] }}</span>
                  </div>
                }
              </div>
            } @else {
              <div class="card-header"><span class="card-title">Key Rate Duration</span><span class="card-subtitle">bps change by tenor</span></div>
              <div style="flex:1;padding:0.5rem;min-height:0;">
                <p-chart type="bar" [data]="krdChartData" [options]="krdChartOpts" height="100%" width="100%" />
              </div>
            }
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .panel { height: 100%; display: flex; flex-direction: column; padding: 0.75rem; overflow: hidden; }
    .main-area { display: grid; grid-template-columns: 1fr 272px; gap: 0.75rem; flex: 1; min-height: 0; }
    .grid-col { display: flex; flex-direction: column; overflow: hidden; }
    .grid-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-shrink: 0; }
    .flex-1 { flex: 1; min-height: 0; }
    .sidebar { display: flex; flex-direction: column; gap: 0.75rem; min-height: 0; overflow: hidden; }
    .card { background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
    .shrink-0 { flex-shrink: 0; }
    .card-header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; border-bottom: 1px solid var(--ds-border); flex-shrink: 0; }
    .card-title { font-size: 0.75rem; font-weight: 600; }
    .card-subtitle { font-size: 10px; color: var(--ds-muted-foreground); margin-left: 0.5rem; }
    .legend-row { display: flex; gap: 0.75rem; font-size: 10px; color: var(--ds-muted-foreground); }
    .legend-item { display: flex; align-items: center; gap: 4px; }
    .leg-line { display: inline-block; width: 12px; height: 1px; }
    .leg-line.primary { background: var(--ds-primary); }
    .leg-line.muted { background: var(--ds-muted-foreground); opacity: 0.5; }
    .spreads-grid { display: grid; grid-template-columns: 1fr 1fr; }
    .spread-cell { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; font-size: 11px; }
    .border-right { border-right: 1px solid var(--ds-border); }
    .border-bottom { border-bottom: 1px solid var(--ds-border); }
    .spread-label { font-family: var(--ds-font-mono); color: var(--ds-muted-foreground); }
    .spread-val { font-family: var(--ds-font-mono); font-weight: 600; }
    .detail-list { padding: 0.75rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 11px; font-family: var(--ds-font-mono); overflow-y: auto; }
    .detail-row { display: flex; justify-content: space-between; }
    .muted { color: var(--ds-muted-foreground); }
    .mono { font-family: var(--ds-font-mono); }
    .close-btn { background: none; border: none; color: var(--ds-muted-foreground); cursor: pointer; font-size: 1rem; line-height: 1; padding: 0 4px; }
    .buy  { color: var(--ds-buy); }
    .sell { color: var(--ds-sell); }
  `],
})
export class RatesPanelComponent implements OnInit, OnDestroy {
  readonly theme = marketsUITheme
  readonly rowSel = { mode: 'singleRow' as const, checkboxes: false, enableClickSelection: true }

  treasuries: Treasury[] = []
  yieldCurve: YieldCurvePoint[] = []
  selectedT: Treasury | null = null
  curveSpreads: { label: string; val: number | null }[] = []
  yieldChartData: any = {}
  yieldChartOpts: any = {}
  krdChartData: any = {}
  krdChartOpts: any = {}
  detailRows: [string, string][] = []

  colDefs: ColDef<Treasury>[] = [
    { field: 'tenor',       headerName: 'Tenor',    width: 60,  cellClass: 'font-semibold' },
    { field: 'label',       headerName: 'Security', flex: 1,    minWidth: 140 },
    { field: 'coupon',      headerName: 'Cpn',      width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => p.value.toFixed(3) + '%' },
    { field: 'maturity',    headerName: 'Maturity', width: 88,  cellClass: 'font-mono' },
    { field: 'bidYield',    headerName: 'Bid Yld',  width: 80,  type: 'numericColumn', cellClass: 'font-mono font-semibold', cellStyle: () => ({ color: 'var(--ds-buy)' }), valueFormatter: (p: any) => fmtYield(p.value) },
    { field: 'askYield',    headerName: 'Ask Yld',  width: 78,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-sell)' }), valueFormatter: (p: any) => fmtYield(p.value) },
    { field: 'bidPrice',    headerName: 'Bid Px',   width: 76,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => fmtPrice(p.value) },
    { field: 'askPrice',    headerName: 'Ask Px',   width: 76,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => fmtPrice(p.value) },
    {
      field: 'change', headerName: 'Chg (bps)', width: 82, type: 'numericColumn',
      cellStyle: (p: any): any => ({ color: p.value < 0 ? 'var(--ds-buy)' : p.value > 0 ? 'var(--ds-sell)' : undefined }),
      valueFormatter: (p: any) => (p.value >= 0 ? '+' : '') + p.value.toFixed(1),
      cellClass: 'font-mono',
    },
    { field: 'modDuration', headerName: 'Mod Dur',  width: 76,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => p.value.toFixed(3) },
    { field: 'dv01PerMM',   headerName: 'DV01/MM',  width: 84,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => '$' + p.value.toLocaleString() },
  ]

  defaultColDef: ColDef = { sortable: true, resizable: true, minWidth: 50 }

  private subs = new Subscription()

  constructor(private marketData: MarketDataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buildChartOpts()
    this.subs.add(this.marketData.treasuries$.subscribe(t => {
      this.treasuries = t
      this.updateSpreads(t)
      this.buildKrdChart(t)
      this.cdr.markForCheck()
    }))
    this.subs.add(this.marketData.yieldCurve$.subscribe(yc => {
      this.yieldCurve = yc
      this.buildYieldChart(yc)
      this.cdr.markForCheck()
    }))
  }

  onRowClicked(e: RowClickedEvent<Treasury>): void {
    this.selectedT = this.selectedT?.tenor === e.data?.tenor ? null : (e.data ?? null)
    if (this.selectedT) this.buildDetailRows(this.selectedT)
    this.cdr.markForCheck()
  }

  private buildDetailRows(t: Treasury): void {
    this.detailRows = [
      ['CUSIP',    t.cusip],
      ['Coupon',   t.coupon.toFixed(3) + '%'],
      ['Maturity', t.maturity],
      ['Mid Yield', fmtYield((t.bidYield + t.askYield) / 2)],
      ['Bid/Ask',  fmtPrice(t.bidPrice) + ' / ' + fmtPrice(t.askPrice)],
      ['Mod Dur',  t.modDuration.toFixed(3)],
      ['DV01/MM',  '$' + t.dv01PerMM.toLocaleString()],
      ['Settle',   'T+1'],
    ]
  }

  private updateSpreads(t: Treasury[]): void {
    const yMap = Object.fromEntries(t.map(x => [x.tenor, x.bidYield]))
    const gs = (t1: string, t2: string) => {
      const y1 = yMap[t1], y2 = yMap[t2]
      if (!y1 || !y2) return null
      return Math.round((y2 - y1) * 100 * 10) / 10
    }
    const gf = (t1: string, t2: string, t3: string) => {
      const y1 = yMap[t1], y2 = yMap[t2], y3 = yMap[t3]
      if (!y1 || !y2 || !y3) return null
      return Math.round((-y1 + 2 * y2 - y3) * 100 * 10) / 10
    }
    this.curveSpreads = CURVE_SPREADS.map(s => ({
      label: s.label,
      val: s.isFly ? gf(s.tenors[0], s.tenors[1], s.tenors[2]) : gs(s.tenors[0], s.tenors[1]),
    }))
  }

  private buildYieldChart(yc: YieldCurvePoint[]): void {
    this.yieldChartData = {
      labels: yc.map(p => p.tenor),
      datasets: [
        { label: 'Today', data: yc.map(p => p.yield), borderColor: 'var(--ds-primary)', backgroundColor: 'rgba(22,82,240,0.15)', borderWidth: 1.5, tension: 0.4, fill: true, pointRadius: 0 },
        { label: 'Prior',  data: yc.map(p => p.prevYield), borderColor: 'var(--ds-muted-foreground)', backgroundColor: 'transparent', borderWidth: 1, borderDash: [3, 3], tension: 0.4, fill: false, pointRadius: 0 },
      ],
    }
  }

  private buildKrdChart(t: Treasury[]): void {
    const krd = t.filter(x => !['1M', '3M', '6M', '1Y'].includes(x.tenor))
    this.krdChartData = {
      labels: krd.map(x => x.tenor),
      datasets: [{
        label: 'Yield Chg',
        data: krd.map(x => x.change),
        backgroundColor: krd.map(x => x.change < 0 ? 'rgba(0,163,108,0.75)' : 'rgba(207,32,47,0.75)'),
        borderRadius: 3,
      }],
    }
  }

  private buildChartOpts(): void {
    const base = {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { size: 8 }, color: 'var(--ds-muted-foreground)' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { font: { size: 8 }, color: 'var(--ds-muted-foreground)' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
    }
    this.yieldChartOpts = { ...base }
    this.krdChartOpts = { ...base }
  }

  ngOnDestroy(): void { this.subs.unsubscribe() }
}
