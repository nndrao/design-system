import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChartModule } from 'primeng/chart'
import { BASE_POSITIONS, fmtDV01, fmtPnL } from '../market-data.service'

const DV01_BY_TENOR = [
  { tenor: '0-1Y',   dv01: -30_000  },
  { tenor: '1-2Y',   dv01:  38_276  },
  { tenor: '2-5Y',   dv01: 112_175  },
  { tenor: '5-10Y',  dv01: 263_100  },
  { tenor: '10-20Y', dv01: -133_755 },
  { tenor: '20-30Y', dv01: 171_149  },
]

const CREDIT_EXPOSURE = [
  { name: 'Financials', cs01: 32_184 },
  { name: 'Technology', cs01: 11_482 },
  { name: 'CDX Index',  cs01: 24_100 },
]

const RISK_LIMITS = [
  { metric: 'Net DV01',          current: 420_945,   limit: 600_000   },
  { metric: 'Gross DV01',        current: 1_165_955, limit: 1_500_000 },
  { metric: 'Net CS01',          current: 57_182,    limit: 100_000   },
  { metric: 'IG Credit Exp.',    current: 195_091,   limit: 300_000   },
  { metric: 'HY Credit Exp.',    current: 0,         limit: 75_000    },
  { metric: 'Single-tenor DV01', current: 263_100,   limit: 400_000   },
  { metric: 'Max Loss (1-day)',   current: 93_170,    limit: 500_000   },
]

const VAR_DATA = [
  { confidence: '95%',   var1d: 285_000, var10d: 901_000   },
  { confidence: '99%',   var1d: 412_000, var10d: 1_303_000 },
  { confidence: '99.9%', var1d: 594_000, var10d: 1_878_000 },
]

const STRESS_SCENARIOS = [
  { scenario: '+25bp parallel',    pnl: -105_236 },
  { scenario: '+50bp parallel',    pnl: -210_473 },
  { scenario: '+100bp parallel',   pnl: -420_945 },
  { scenario: '-25bp parallel',    pnl: +105_236 },
  { scenario: 'Steepen +25bp',     pnl: -48_120  },
  { scenario: 'Flatten +25bp',     pnl: +31_840  },
  { scenario: 'Credit +50bp',      pnl: -28_591  },
  { scenario: 'Credit +100bp',     pnl: -57_182  },
  { scenario: '2008 credit shock', pnl: -342_500 },
]

@Component({
  selector: 'app-risk-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">

      <!-- KPI row -->
      <div class="kpi-row">
        @for (k of kpis; track k.label) {
          <div class="kpi-card">
            <div class="kpi-label">{{ k.label }}</div>
            <div class="kpi-value" [class.buy]="k.cls === 'buy'" [class.sell]="k.cls === 'sell'" [class.warning]="k.cls === 'warning'">{{ k.value }}</div>
            <div class="kpi-sub">{{ k.sub }}</div>
          </div>
        }
      </div>

      <!-- Main 3-col -->
      <div class="main-cols">

        <!-- DV01 by tenor -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">DV01 by Tenor Bucket</span>
            <span class="card-subtitle">$ per basis point</span>
          </div>
          <div style="flex:1;padding:0.75rem;min-height:0">
            <p-chart type="bar" [data]="dv01ChartData" [options]="dv01ChartOpts" height="100%" width="100%" />
          </div>
        </div>

        <!-- Risk Limits -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Risk Limits</span>
            <span class="card-subtitle">RATES-01 / CREDIT-01</span>
          </div>
          <div class="limits-list">
            @for (l of limits; track l.metric) {
              <div class="limit-item">
                <div class="limit-header">
                  <span class="muted small">{{ l.metric }}</span>
                  <span class="mono tiny">{{ '$' + (l.current / 1000).toFixed(0) + 'K / $' + (l.limit / 1000).toFixed(0) + 'K' }}</span>
                </div>
                <div class="limit-track">
                  <div class="limit-fill" [class.green]="l.pct < 70" [class.amber]="l.pct >= 70 && l.pct < 90" [class.red]="l.pct >= 90" [style.width.%]="l.pct"></div>
                </div>
                <div class="tiny muted">{{ l.pct.toFixed(0) }}% used</div>
              </div>
            }
          </div>
        </div>

        <!-- CS01 pie + VaR -->
        <div class="col3">
          <div class="card shrink-0">
            <div class="card-header"><span class="card-title">CS01 by Sector</span></div>
            <div style="height:11rem;padding:0.25rem">
              <p-chart type="doughnut" [data]="cs01ChartData" [options]="cs01ChartOpts" height="100%" width="100%" />
            </div>
          </div>

          <div class="card flex-1">
            <div class="card-header">
              <span class="card-title">Value-at-Risk</span>
              <span class="card-subtitle">1Y historical</span>
            </div>
            <table class="var-table">
              <thead>
                <tr><th>Confidence</th><th>1-Day</th><th>10-Day</th></tr>
              </thead>
              <tbody>
                @for (v of varData; track v.confidence) {
                  <tr>
                    <td class="muted">{{ v.confidence }}</td>
                    <td class="sell mono">{{ '$' + v.var1d.toLocaleString() }}</td>
                    <td class="sell-muted mono">{{ '$' + v.var10d.toLocaleString() }}</td>
                  </tr>
                }
              </tbody>
            </table>
            <div class="var-footer">
              <div class="var-row"><span class="muted">ES (99%)</span><span class="sell mono">$528,000</span></div>
              <div class="var-row"><span class="muted">Max Drawdown (30d)</span><span class="sell mono">$184,230</span></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Stress scenarios -->
      <div class="card shrink-0">
        <div class="card-header">
          <span class="card-title">Stress Scenarios</span>
          <span class="card-subtitle">Instantaneous shocks</span>
        </div>
        <div class="stress-grid">
          @for (s of stressScenarios; track s.scenario) {
            <div class="stress-cell">
              <div class="muted tiny leading-tight">{{ s.scenario }}</div>
              <div class="mono semibold small" [class.buy]="s.pnl >= 0" [class.sell]="s.pnl < 0">{{ fmtPnL(s.pnl) }}</div>
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .panel { height: 100%; display: flex; flex-direction: column; gap: 0.75rem; padding: 0.75rem; overflow: hidden; }
    .flex-1 { flex: 1; min-height: 0; }
    .shrink-0 { flex-shrink: 0; }

    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; flex-shrink: 0; }
    .kpi-card { background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 12px; padding: 0.75rem 1rem; }
    .kpi-label { font-size: 10px; color: var(--ds-muted-foreground); text-transform: uppercase; letter-spacing: 0.08em; }
    .kpi-value { font-size: 1.2rem; font-weight: 600; font-family: var(--ds-font-mono); margin-top: 2px; line-height: 1.2; color: var(--ds-foreground); }
    .kpi-sub   { font-size: 10px; color: var(--ds-muted-foreground); margin-top: 2px; }

    .main-cols { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
    .card { background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
    .card-header { padding: 0.625rem 1rem; border-bottom: 1px solid var(--ds-border); display: flex; align-items: center; flex-shrink: 0; }
    .card-title { font-size: 0.75rem; font-weight: 600; }
    .card-subtitle { font-size: 10px; color: var(--ds-muted-foreground); margin-left: 0.5rem; }

    .limits-list { flex: 1; overflow-y: auto; padding: 0.75rem 1rem; display: flex; flex-direction: column; gap: 1rem; }
    .limit-item { display: flex; flex-direction: column; gap: 4px; }
    .limit-header { display: flex; justify-content: space-between; }
    .limit-track { height: 6px; background: var(--ds-secondary); border-radius: 9999px; overflow: hidden; }
    .limit-fill { height: 100%; border-radius: 9999px; }
    .limit-fill.green { background: var(--ds-buy); }
    .limit-fill.amber { background: var(--ds-warning); }
    .limit-fill.red   { background: var(--ds-sell); }

    .col3 { display: flex; flex-direction: column; gap: 0.75rem; min-height: 0; overflow: hidden; }

    .var-table { width: 100%; font-size: 11px; border-collapse: collapse; }
    .var-table thead tr { border-bottom: 1px solid var(--ds-border); }
    .var-table th { padding: 0.375rem 1rem; font-weight: 500; color: var(--ds-muted-foreground); text-align: right; }
    .var-table th:first-child { text-align: left; }
    .var-table td { padding: 0.5rem 1rem; text-align: right; border-bottom: 1px solid var(--ds-border); }
    .var-table td:first-child { text-align: left; }
    .var-footer { padding: 0.625rem 1rem; border-top: 1px solid var(--ds-border); display: flex; flex-direction: column; gap: 0.375rem; font-size: 11px; }
    .var-row { display: flex; justify-content: space-between; }

    .stress-grid { display: grid; grid-template-columns: repeat(9, 1fr); }
    .stress-cell { padding: 0.5rem 0.75rem; border-right: 1px solid var(--ds-border); }
    .stress-cell:last-child { border-right: none; }

    .muted { color: var(--ds-muted-foreground); }
    .sell-muted { color: var(--ds-sell); opacity: 0.7; }
    .tiny  { font-size: 10px; }
    .small { font-size: 11px; }
    .mono  { font-family: var(--ds-font-mono); }
    .semibold { font-weight: 600; }
    .leading-tight { line-height: 1.2; }
    .buy     { color: var(--ds-buy); }
    .sell    { color: var(--ds-sell); }
    .warning { color: var(--ds-warning); }
  `],
})
export class RiskPanelComponent implements OnInit {
  readonly fmtPnL = fmtPnL
  readonly limits = RISK_LIMITS.map(l => ({ ...l, pct: Math.min((l.current / l.limit) * 100, 100) }))
  readonly varData = VAR_DATA
  readonly stressScenarios = STRESS_SCENARIOS

  kpis: { label: string; value: string; sub: string; cls: string }[] = []
  dv01ChartData: any = {}
  dv01ChartOpts: any = {}
  cs01ChartData: any = {}
  cs01ChartOpts: any = {}

  ngOnInit(): void {
    const totalDV01 = BASE_POSITIONS.reduce((s, p) => s + p.dv01, 0)
    const totalCS01 = BASE_POSITIONS.reduce((s, p) => s + p.cs01, 0)
    const totalPnl  = BASE_POSITIONS.reduce((s, p) => s + p.pnlToday, 0)

    this.kpis = [
      { label: 'Net DV01',        value: fmtDV01(totalDV01), sub: '$/bp rate sensitivity',   cls: '' },
      { label: 'Net CS01',        value: fmtDV01(totalCS01), sub: '$/bp credit sensitivity', cls: '' },
      { label: 'P&L Today',       value: fmtPnL(totalPnl),   sub: 'Mark-to-market',          cls: totalPnl >= 0 ? 'buy' : 'sell' },
      { label: '1-Day VaR (99%)', value: '$412K',            sub: 'Historical simulation',   cls: 'warning' },
    ]

    this.dv01ChartData = {
      labels: DV01_BY_TENOR.map(d => d.tenor),
      datasets: [{
        label: 'DV01', data: DV01_BY_TENOR.map(d => d.dv01),
        backgroundColor: DV01_BY_TENOR.map(d => d.dv01 >= 0 ? 'rgba(0,163,108,0.75)' : 'rgba(207,32,47,0.75)'),
        borderRadius: 3,
      }],
    }
    this.dv01ChartOpts = {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => '$' + Math.abs(ctx.parsed.y).toLocaleString() + ' DV01' } } },
      scales: {
        x: { ticks: { font: { size: 9 }, color: 'var(--ds-muted-foreground)' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { font: { size: 9 }, color: 'var(--ds-muted-foreground)', callback: (v: number) => '$' + (v / 1000).toFixed(0) + 'K' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
    }

    this.cs01ChartData = {
      labels: CREDIT_EXPOSURE.map(c => c.name),
      datasets: [{
        data: CREDIT_EXPOSURE.map(c => c.cs01),
        backgroundColor: ['var(--ds-primary)', 'var(--ds-buy)', 'var(--ds-warning)'],
        hoverOffset: 4,
      }],
    }
    this.cs01ChartOpts = {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 8, padding: 8 } },
        tooltip: { callbacks: { label: (ctx: any) => '$' + ctx.parsed.toLocaleString() + ' CS01' } },
      },
    }
  }
}
