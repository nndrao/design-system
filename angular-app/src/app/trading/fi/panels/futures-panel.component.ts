import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import { AgGridAngular } from 'ag-grid-angular'
import { AllEnterpriseModule, ModuleRegistry } from 'ag-grid-enterprise'
import type { ColDef } from 'ag-grid-community'
import { ChartModule } from 'primeng/chart'
import { marketsUITheme } from '../ag-grid-theme'
import { MarketDataService, fmtK, type TreasuryFuture, type SOFRFuture } from '../market-data.service'

ModuleRegistry.registerModules([AllEnterpriseModule])

function to32nds(price: number): string {
  const whole = Math.floor(price)
  const frac  = price - whole
  const t32   = frac * 32
  const t32i  = Math.floor(t32)
  const half  = t32 - t32i >= 0.5 ? '+' : ''
  return `${whole}-${String(t32i).padStart(2, '0')}${half}`
}

@Component({
  selector: 'app-futures-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, AgGridAngular, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">

      <!-- Top: Treasury futures grid + SOFR curve -->
      <div class="top-area">

        <div class="grid-col">
          <div class="grid-header">
            <div>
              <span class="card-title">US Treasury Futures</span>
              <span class="muted small"> CME Globex · Mar-26</span>
            </div>
            <span class="muted small">32nds in parentheses</span>
          </div>
          <div class="flex-1">
            <ag-grid-angular
              [theme]="theme" [rowData]="tFutures" [columnDefs]="tColDefs" [defaultColDef]="defaultColDef"
              [rowHeight]="34" [headerHeight]="30" [suppressCellFocus]="true" [enableCellTextSelection]="true"
              style="height:100%;width:100%"
            />
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">SOFR Implied Forward Rate Curve</span>
            <span class="muted small">From futures prices</span>
          </div>
          <div class="flex-1 p-2">
            <p-chart type="line" [data]="sofrChartData" [options]="sofrChartOpts" height="100%" width="100%" />
          </div>
          <div class="sofr-stats">
            <div>
              <div class="muted small">Nearest</div>
              <div class="mono semibold">{{ sofrFutures[0]?.impliedRate?.toFixed(3) }}%</div>
            </div>
            <div>
              <div class="muted small">Farthest</div>
              <div class="mono semibold">{{ sofrFutures[sofrFutures.length - 1]?.impliedRate?.toFixed(3) }}%</div>
            </div>
            <div>
              <div class="muted small">Steepness</div>
              <div class="mono semibold buy">{{ steepness }} bps</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom: SOFR strip -->
      <div class="bottom-strip">
        <div class="grid-header">
          <span class="card-title">3-Month SOFR Futures Strip</span>
          <span class="muted small">CME SR3 · 100 − Implied SOFR Rate</span>
        </div>
        <div style="height: calc(100% - 28px)">
          <ag-grid-angular
            [theme]="theme" [rowData]="sofrFutures" [columnDefs]="sColDefs" [defaultColDef]="defaultColDef"
            [rowHeight]="30" [headerHeight]="28" [suppressCellFocus]="true" [enableCellTextSelection]="true"
            style="height:100%;width:100%"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .panel { height: 100%; display: flex; flex-direction: column; gap: 0.75rem; padding: 0.75rem; overflow: hidden; }
    .flex-1 { flex: 1; min-height: 0; }

    .top-area { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 320px; gap: 0.75rem; }
    .grid-col { display: flex; flex-direction: column; overflow: hidden; }
    .grid-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-shrink: 0; }

    .card { background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
    .card-header { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 1rem; border-bottom: 1px solid var(--ds-border); flex-shrink: 0; }
    .card-title { font-size: 0.75rem; font-weight: 600; }
    .p-2 { padding: 0.5rem; }

    .sofr-stats { border-top: 1px solid var(--ds-border); padding: 0.625rem 1rem; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; font-size: 10px; flex-shrink: 0; }

    .bottom-strip { flex-shrink: 0; height: 200px; }

    .muted   { color: var(--ds-muted-foreground); }
    .small   { font-size: 10px; }
    .mono    { font-family: var(--ds-font-mono); }
    .semibold { font-weight: 600; }
    .buy  { color: var(--ds-buy); }
    .sell { color: var(--ds-sell); }
  `],
})
export class FuturesPanelComponent implements OnInit, OnDestroy {
  readonly theme = marketsUITheme

  tFutures: TreasuryFuture[] = []
  sofrFutures: SOFRFuture[] = []
  sofrChartData: any = {}
  sofrChartOpts: any = {}
  steepness = '0'

  tColDefs: ColDef<TreasuryFuture>[] = [
    { field: 'symbol',          headerName: 'Symbol',   width: 64,  cellStyle: () => ({ color: 'var(--ds-primary)', fontWeight: 600, fontFamily: 'monospace' }) },
    { field: 'description',     headerName: 'Desc',     flex: 1,    minWidth: 100 },
    { field: 'bidPrice',        headerName: 'Bid',      width: 72,  type: 'numericColumn', cellClass: 'font-mono font-semibold', cellStyle: () => ({ color: 'var(--ds-buy)' }), valueFormatter: (p: any) => p.value.toFixed(3) },
    { field: 'askPrice',        headerName: 'Ask',      width: 72,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-sell)' }), valueFormatter: (p: any) => p.value.toFixed(3) },
    { field: 'lastPrice',       headerName: 'Last',     width: 72,  type: 'numericColumn', cellClass: 'font-mono font-semibold', valueFormatter: (p: any) => p.value.toFixed(3) },
    { colId: '32nds',           headerName: '(32nds)',  width: 72,  sortable: false, valueGetter: (p: any) => p.data ? `(${to32nds(p.data.lastPrice)})` : '' },
    { field: 'change',          headerName: 'Chg',      width: 68,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: (p: any) => ({ color: (p.value as number) < 0 ? 'var(--ds-sell)' : 'var(--ds-buy)' }), valueFormatter: (p: any) => (p.value > 0 ? '+' : '') + p.value.toFixed(3) },
    { field: 'settle',          headerName: 'Settle',   width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => p.value.toFixed(3) },
    { field: 'high',            headerName: 'High',     width: 68,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-buy)' }), valueFormatter: (p: any) => p.value.toFixed(3) },
    { field: 'low',             headerName: 'Low',      width: 68,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-sell)' }), valueFormatter: (p: any) => p.value.toFixed(3) },
    { field: 'dv01PerContract', headerName: 'DV01/ct',  width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => '$' + p.value },
    { field: 'openInterest',    headerName: 'Open Int', width: 78,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => fmtK(p.value) },
    { field: 'volume',          headerName: 'Volume',   width: 72,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => fmtK(p.value) },
  ]

  sColDefs: ColDef<SOFRFuture>[] = [
    { field: 'contract',     headerName: 'Contract',  flex: 1,  minWidth: 80 },
    { field: 'symbol',       headerName: 'Symbol',    width: 72, cellStyle: () => ({ color: 'var(--ds-primary)', fontWeight: 600, fontFamily: 'monospace' }) },
    { field: 'price',        headerName: 'Price',     width: 72, type: 'numericColumn', cellClass: 'font-mono font-semibold', valueFormatter: (p: any) => p.value.toFixed(3) },
    { field: 'change',       headerName: 'Chg',       width: 68, type: 'numericColumn', cellClass: 'font-mono', cellStyle: (p: any) => ({ color: (p.value as number) < 0 ? 'var(--ds-sell)' : 'var(--ds-buy)' }), valueFormatter: (p: any) => (p.value > 0 ? '+' : '') + p.value.toFixed(3) },
    { field: 'impliedRate',  headerName: 'Impl Rate', width: 84, type: 'numericColumn', cellClass: 'font-mono font-semibold', valueFormatter: (p: any) => p.value.toFixed(3) + '%' },
    { field: 'volume',       headerName: 'Volume',    width: 72, type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => fmtK(p.value) },
    { field: 'openInterest', headerName: 'Open Int',  width: 78, type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => fmtK(p.value) },
  ]

  defaultColDef: ColDef = { sortable: true, resizable: true, minWidth: 50 }

  private subs = new Subscription()

  constructor(private marketData: MarketDataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buildChartOpts()
    this.subs.add(this.marketData.tFutures$.subscribe(f => { this.tFutures = f; this.cdr.markForCheck() }))
    this.subs.add(this.marketData.sofrFutures$.subscribe(f => {
      this.sofrFutures = f
      this.buildSofrChart(f)
      if (f.length > 1) {
        this.steepness = (-(f[f.length - 1].impliedRate - f[0].impliedRate) * 100).toFixed(0)
      }
      this.cdr.markForCheck()
    }))
  }

  private buildSofrChart(f: SOFRFuture[]): void {
    this.sofrChartData = {
      labels: f.map(x => x.contract),
      datasets: [{
        label: 'Implied SOFR',
        data: f.map(x => x.impliedRate),
        borderColor: 'var(--ds-primary)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'var(--ds-primary)',
      }],
    }
  }

  private buildChartOpts(): void {
    this.sofrChartOpts = {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ctx.parsed.y.toFixed(3) + '% Implied SOFR' } } },
      scales: {
        x: { ticks: { font: { size: 9 }, color: 'var(--ds-muted-foreground)' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { font: { size: 9 }, color: 'var(--ds-muted-foreground)', callback: (v: number) => v.toFixed(2) + '%' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
    }
  }

  ngOnDestroy(): void { this.subs.unsubscribe() }
}
