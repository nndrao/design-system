import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subscription, combineLatest } from 'rxjs'
import { ChartModule } from 'primeng/chart'
import {
  MarketDataService, fmtYield, fmtBps, fmtPnL, fmtDV01,
  BASE_ORDERS, BASE_POSITIONS,
  type Treasury, type YieldCurvePoint, type CDXIndex,
} from '../market-data.service'

const TOTAL_PNL_TODAY = 93_170
const TOTAL_PNL_MTD   = 243_135
const TOTAL_PNL_YTD   = 590_320
const TOTAL_DV01       = 420_945
const TOTAL_CS01       = 57_182

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">

      <!-- KPI row -->
      <div class="kpi-row">
        <div class="kpi-card">
          <span class="kpi-label">P&amp;L Today</span>
          <span class="kpi-value" [class.buy]="true">{{ fmtPnL(TOTAL_PNL_TODAY) }}</span>
          <span class="kpi-sub">All strategies</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">P&amp;L MTD</span>
          <span class="kpi-value buy">{{ fmtPnL(TOTAL_PNL_MTD) }}</span>
          <span class="kpi-sub">March 2026</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">P&amp;L YTD</span>
          <span class="kpi-value buy">{{ fmtPnL(TOTAL_PNL_YTD) }}</span>
          <span class="kpi-sub">Since Jan 1</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Net DV01</span>
          <span class="kpi-value">{{ fmtDV01(TOTAL_DV01) }}</span>
          <span class="kpi-sub">Portfolio rate sensitivity</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Net CS01</span>
          <span class="kpi-value">{{ fmtDV01(TOTAL_CS01) }}</span>
          <span class="kpi-sub">Portfolio credit sensitivity</span>
        </div>
      </div>

      <!-- Middle: Yield curve + Benchmarks -->
      <div class="mid-row flex-1">

        <!-- Yield curve chart -->
        <div class="card">
          <div class="card-header">
            <div>
              <span class="card-title">US Treasury Yield Curve</span>
              <span class="card-subtitle">On-The-Run · Live</span>
            </div>
            <div class="legend-row">
              <span class="legend-item"><span class="legend-line primary"></span> Today</span>
              <span class="legend-item"><span class="legend-line muted"></span> Prev Close</span>
            </div>
          </div>
          <div class="chart-area">
            <p-chart type="line" [data]="yieldChartData" [options]="yieldChartOpts" height="100%" width="100%" />
          </div>
        </div>

        <!-- Benchmarks -->
        <div class="card">
          <div class="card-header"><span class="card-title">Key Benchmarks</span></div>
          <div class="bench-list">
            @for (b of benchmarks; track b.label) {
              <div class="bench-row">
                <span class="bench-label">{{ b.label }}</span>
                <div class="bench-right">
                  <div class="bench-val">{{ b.displayVal }}</div>
                  @if (b.change !== null) {
                    <div class="bench-chg" [class.buy]="b.change < 0" [class.sell]="b.change > 0">
                      {{ fmtBps(b.change) }}
                    </div>
                  }
                </div>
              </div>
            }
            <div class="bench-row">
              <span class="bench-label">2s10s Slope</span>
              <div class="bench-right">
                <div class="bench-val" [class.buy]="slope >= 0" [class.sell]="slope < 0">
                  {{ slope > 0 ? '+' : '' }}{{ slope }} bps
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom: Positions + Orders -->
      <div class="bottom-row">

        <!-- Position summary -->
        <div class="card pos-card">
          <div class="card-header"><span class="card-title">Position Summary</span></div>
          <div class="scroll-list">
            @for (p of positions; track p.id) {
              <div class="pos-row">
                <div>
                  <div class="pos-sec" [class.buy]="p.direction === 'Long'" [class.sell]="p.direction === 'Short'">
                    {{ p.direction === 'Long' ? '▲' : '▼' }} {{ p.security }}
                  </div>
                  <div class="pos-class">{{ p.assetClass }}</div>
                </div>
                <div class="pos-right">
                  <div [class.buy]="p.pnlToday >= 0" [class.sell]="p.pnlToday < 0">{{ fmtPnL(p.pnlToday) }}</div>
                  <div class="pos-dv01">{{ fmtDV01(absNum(p.dv01)) }} dv01</div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Recent orders -->
        <div class="card orders-card">
          <div class="card-header">
            <span class="card-title">Recent Orders</span>
            <span class="card-subtitle">Today · {{ orders.length }} orders</span>
          </div>
          <div class="table-scroll">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Security</th>
                  <th>Side</th>
                  <th class="text-right">Size</th>
                  <th class="text-right">Yield/Price</th>
                  <th class="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (o of recentOrders; track o.id) {
                  <tr>
                    <td class="mono muted">{{ o.time }}</td>
                    <td>
                      <div class="sec-name">{{ o.security }}</div>
                      <div class="sec-acct">{{ o.account }}</div>
                    </td>
                    <td class="side" [class.buy]="o.side === 'Buy'" [class.sell]="o.side === 'Sell'">{{ o.side }}</td>
                    <td class="text-right mono">{{ o.cusip.startsWith('CME') ? o.faceValueMM + ' cts' : '$' + o.faceValueMM + 'MM' }}</td>
                    <td class="text-right mono muted">{{ o.avgFillYield ? o.avgFillYield.toFixed(3) + '%' : o.limitPrice ? o.limitPrice.toFixed(3) : '—' }}</td>
                    <td class="text-right"><span class="status-badge" [ngClass]="statusClass(o.status)">{{ o.status }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .panel { height: 100%; display: flex; flex-direction: column; gap: 0.75rem; padding: 0.75rem; overflow: hidden; }
    .flex-1 { flex: 1; min-height: 0; }

    .kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; flex-shrink: 0; }
    .kpi-card { background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 12px; padding: 0.75rem 1rem; display: flex; flex-direction: column; gap: 2px; }
    .kpi-label { font-size: 10px; color: var(--ds-muted-foreground); text-transform: uppercase; letter-spacing: 0.08em; }
    .kpi-value { font-size: 1.2rem; font-weight: 600; font-family: var(--ds-font-mono); line-height: 1.2; margin-top: 2px; color: var(--ds-foreground); }
    .kpi-value.buy { color: var(--ds-buy); }
    .kpi-value.sell { color: var(--ds-sell); }
    .kpi-sub { font-size: 10px; color: var(--ds-muted-foreground); }

    .mid-row { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr; gap: 0.75rem; flex: 1; min-height: 0; height: 100%; }
    .bottom-row { display: grid; grid-template-columns: 1fr 2fr; gap: 0.75rem; height: 210px; flex-shrink: 0; }

    .card { background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
    .pos-card { }
    .orders-card { }

    .card-header { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 1rem; border-bottom: 1px solid var(--ds-border); flex-shrink: 0; }
    .card-title { font-size: 0.75rem; font-weight: 600; }
    .card-subtitle { font-size: 10px; color: var(--ds-muted-foreground); margin-left: 0.5rem; }
    .legend-row { display: flex; align-items: center; gap: 0.75rem; font-size: 10px; color: var(--ds-muted-foreground); }
    .legend-item { display: flex; align-items: center; gap: 4px; }
    .legend-line { display: inline-block; width: 12px; height: 2px; border-radius: 1px; }
    .legend-line.primary { background: var(--ds-primary); }
    .legend-line.muted { background: var(--ds-muted-foreground); opacity: 0.5; }

    .chart-area { flex: 1; padding: 0.5rem; min-height: 0; display: flex; align-items: stretch; }
    .chart-area p-chart, .chart-area ::ng-deep canvas { width: 100% !important; height: 100% !important; }

    .bench-list { display: flex; flex-direction: column; flex: 1; overflow-y: auto; }
    .bench-row { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 1rem; border-bottom: 1px solid var(--ds-border); }
    .bench-row:last-child { border-bottom: none; }
    .bench-label { font-size: 12px; color: var(--ds-muted-foreground); font-family: var(--ds-font-mono); }
    .bench-right { text-align: right; }
    .bench-val { font-size: 0.875rem; font-family: var(--ds-font-mono); font-weight: 600; }
    .bench-chg { font-size: 10px; font-family: var(--ds-font-mono); }

    .scroll-list { flex: 1; overflow-y: auto; }
    .pos-row { display: flex; align-items: center; justify-content: space-between; padding: 0.375rem 1rem; font-size: 11px; border-bottom: 1px solid var(--ds-border); }
    .pos-sec { font-weight: 500; }
    .pos-class { color: var(--ds-muted-foreground); font-size: 10px; }
    .pos-right { text-align: right; font-family: var(--ds-font-mono); }
    .pos-dv01 { font-size: 10px; color: var(--ds-muted-foreground); }

    .table-scroll { flex: 1; overflow-y: auto; }
    .orders-table { width: 100%; font-size: 11px; border-collapse: collapse; }
    .orders-table thead tr { border-bottom: 1px solid var(--ds-border); position: sticky; top: 0; background: var(--ds-card); z-index: 1; }
    .orders-table th { padding: 0.375rem 0.5rem; font-weight: 500; color: var(--ds-muted-foreground); text-align: left; }
    .orders-table td { padding: 0.375rem 0.5rem; border-bottom: 1px solid var(--ds-border); }
    .text-right { text-align: right !important; }
    .mono { font-family: var(--ds-font-mono); }
    .muted { color: var(--ds-muted-foreground); }
    .side { font-weight: 600; }

    .sec-name { font-weight: 500; }
    .sec-acct { font-size: 10px; color: var(--ds-muted-foreground); }

    .status-badge { font-size: 10px; padding: 2px 6px; border-radius: 9999px; font-weight: 500; }
    .status-filled    { background: rgba(0,163,108,0.15); color: var(--ds-buy); }
    .status-working   { background: rgba(22,82,240,0.15); color: var(--ds-primary); }
    .status-partial   { background: rgba(217,119,6,0.15); color: var(--ds-warning); }
    .status-cancelled { background: var(--ds-secondary); color: var(--ds-muted-foreground); }

    .buy  { color: var(--ds-buy); }
    .sell { color: var(--ds-sell); }
  `],
})
export class DashboardPanelComponent implements OnInit, OnDestroy {
  readonly TOTAL_PNL_TODAY = TOTAL_PNL_TODAY
  readonly TOTAL_PNL_MTD   = TOTAL_PNL_MTD
  readonly TOTAL_PNL_YTD   = TOTAL_PNL_YTD
  readonly TOTAL_DV01       = TOTAL_DV01
  readonly TOTAL_CS01       = TOTAL_CS01
  readonly positions = BASE_POSITIONS
  readonly orders = BASE_ORDERS
  readonly recentOrders = [...BASE_ORDERS].slice(-6).reverse()

  readonly fmtPnL = fmtPnL
  readonly fmtDV01 = fmtDV01
  readonly fmtBps = fmtBps
  readonly fmtYield = fmtYield
  readonly absNum = Math.abs

  slope = 0
  benchmarks: { label: string; displayVal: string; change: number | null }[] = []
  yieldChartData: any = {}
  yieldChartOpts: any = {}

  private subs = new Subscription()

  constructor(
    private marketData: MarketDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.buildChartOpts()

    this.subs.add(this.marketData.treasuries$.subscribe(t => {
      const tsy2Y  = t.find(x => x.tenor === '2Y')
      const tsy10Y = t.find(x => x.tenor === '10Y')
      const tsy30Y = t.find(x => x.tenor === '30Y')
      this.slope = tsy2Y && tsy10Y ? Math.round((tsy10Y.bidYield - tsy2Y.bidYield) * 100) : -34
      this.cdr.markForCheck()
    }))

    this.subs.add(this.marketData.yieldCurve$.subscribe(yc => {
      this.buildChart(yc)
      this.cdr.markForCheck()
    }))

    this.subs.add(combineLatest([this.marketData.treasuries$, this.marketData.cdxIndices$]).subscribe(([t, idx]) => {
      this.updateBenchmarks(t, idx)
      this.cdr.markForCheck()
    }))
  }

  private updateBenchmarks(t: Treasury[], idx: CDXIndex[]): void {
    const tsy2Y  = t.find(x => x.tenor === '2Y')
    const tsy10Y = t.find(x => x.tenor === '10Y')
    const tsy30Y = t.find(x => x.tenor === '30Y')
    const ig = idx.find(c => c.name.includes('NA.IG') && c.tenor === '5Y')
    const hy = idx.find(c => c.name.includes('NA.HY'))
    this.benchmarks = [
      { label: '2Y  UST', displayVal: tsy2Y  ? fmtYield(tsy2Y.bidYield)  : '—', change: tsy2Y?.change  ?? null },
      { label: '10Y UST', displayVal: tsy10Y ? fmtYield(tsy10Y.bidYield) : '—', change: tsy10Y?.change ?? null },
      { label: '30Y UST', displayVal: tsy30Y ? fmtYield(tsy30Y.bidYield) : '—', change: tsy30Y?.change ?? null },
      { label: 'CDX IG',  displayVal: ig ? ((ig.bidSpread + ig.askSpread) / 2).toFixed(1) + ' bps' : '—',  change: ig?.change  ?? null },
      { label: 'CDX HY',  displayVal: hy ? ((hy.bidSpread + hy.askSpread) / 2).toFixed(0) + ' bps' : '—', change: hy?.change ?? null },
    ]
  }

  private buildChart(yc: any[]): void {
    this.yieldChartData = {
      labels: yc.map(p => p.tenor),
      datasets: [
        {
          label: 'Today',
          data: yc.map(p => p.yield),
          borderColor: 'var(--ds-primary)',
          backgroundColor: 'rgba(22,82,240,0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: 'var(--ds-primary)',
        },
        {
          label: 'Prev Close',
          data: yc.map(p => p.prevYield),
          borderColor: 'var(--ds-muted-foreground)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [3, 3],
          tension: 0.4,
          fill: false,
          pointRadius: 0,
        },
      ],
    }
  }

  private buildChartOpts(): void {
    this.yieldChartOpts = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx: any) => ctx.parsed.y.toFixed(3) + '%' },
        },
      },
      scales: {
        x: { ticks: { font: { size: 9 }, color: 'var(--ds-muted-foreground)' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { font: { size: 9 }, color: 'var(--ds-muted-foreground)', callback: (v: number) => v.toFixed(1) + '%' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
    }
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Filled: 'status-filled', Working: 'status-working',
      Partial: 'status-partial', Cancelled: 'status-cancelled',
    }
    return map[status] ?? 'status-cancelled'
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
