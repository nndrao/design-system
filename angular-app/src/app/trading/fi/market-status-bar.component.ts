import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import { MarketDataService, fmtYield, fmtChgBps, type Treasury, type CDXIndex } from './market-data.service'

@Component({
  selector: 'app-market-status-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="status-bar">
      <!-- Market Open/Closed -->
      <div class="status-section border-right">
        <span class="status-dot" [class.open]="isOpen" [class.closed]="!isOpen"></span>
        <span class="muted">{{ isOpen ? 'OPEN' : 'CLOSED' }}</span>
      </div>

      <!-- Benchmark yields -->
      @for (bench of benchmarks; track bench.label) {
        <div class="status-section border-right">
          <span class="muted">{{ bench.label }}</span>
          <span class="fg">{{ bench.yield }}</span>
          @if (bench.chg !== null) {
            <span class="chg" [class.up]="bench.chgVal > 0" [class.dn]="bench.chgVal < 0">{{ bench.chg }}</span>
          }
        </div>
      }

      <!-- 2s10s spread -->
      <div class="status-section border-right">
        <span class="muted">2s10s</span>
        <span class="chg" [class.dn]="slope > 0" [class.up]="slope < 0">{{ slope > 0 ? '+' : '' }}{{ slope }}</span>
      </div>

      <!-- CDX IG -->
      @if (cdxIG) {
        <div class="status-section border-right">
          <span class="muted">CDX IG</span>
          <span class="fg">{{ ((cdxIG.bidSpread + cdxIG.askSpread) / 2).toFixed(1) }}</span>
          <span class="chg small" [class.up]="cdxIG.change > 0" [class.dn]="cdxIG.change < 0">
            {{ cdxIG.change > 0 ? '+' : '' }}{{ cdxIG.change.toFixed(1) }}
          </span>
        </div>
      }

      <!-- CDX HY -->
      @if (cdxHY) {
        <div class="status-section border-right">
          <span class="muted">CDX HY</span>
          <span class="fg">{{ ((cdxHY.bidSpread + cdxHY.askSpread) / 2).toFixed(0) }}</span>
          <span class="chg small" [class.up]="cdxHY.change > 0" [class.dn]="cdxHY.change < 0">
            {{ cdxHY.change > 0 ? '+' : '' }}{{ cdxHY.change.toFixed(1) }}
          </span>
        </div>
      }

      <!-- Time -->
      <div class="status-section ml-auto border-left">
        <span class="muted">{{ timeStr }} ET</span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .status-bar {
      display: flex; align-items: center; gap: 0;
      border-bottom: 1px solid var(--ds-border);
      background: var(--ds-card);
      padding: 0 0.75rem; height: 1.75rem; flex-shrink: 0;
      font-size: 11px; font-family: var(--ds-font-mono); overflow-x: auto;
    }
    .status-section {
      display: flex; align-items: center; gap: 0.375rem;
      padding-right: 0.75rem; margin-right: 0.75rem; white-space: nowrap; flex-shrink: 0;
    }
    .status-section.ml-auto { margin-left: auto; padding-right: 0; margin-right: 0; }
    .border-right { border-right: 1px solid var(--ds-border); }
    .border-left  { border-left: 1px solid var(--ds-border); padding-left: 0.75rem; }
    .status-dot   { width: 6px; height: 6px; border-radius: 50%; background: var(--ds-sell); }
    .status-dot.open  { background: var(--ds-buy); }
    .status-dot.closed{ background: var(--ds-sell); }
    .muted  { color: var(--ds-muted-foreground); }
    .fg     { color: var(--ds-foreground); }
    .chg    { font-size: 10px; }
    .chg.up { color: var(--ds-sell); }
    .chg.dn { color: var(--ds-buy); }
    .small  { font-size: 10px; }
  `],
})
export class MarketStatusBarComponent implements OnInit, OnDestroy {
  treasuries: Treasury[] = []
  cdxIG: CDXIndex | null = null
  cdxHY: CDXIndex | null = null
  slope = 0
  timeStr = ''
  isOpen = false

  benchmarks: { label: string; yield: string; chg: string | null; chgVal: number }[] = []

  private subs = new Subscription()
  private timeInterval: ReturnType<typeof setInterval> | null = null

  constructor(
    private marketData: MarketDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.updateTime()
    this.timeInterval = setInterval(() => { this.updateTime(); this.cdr.markForCheck() }, 1000)

    this.subs.add(this.marketData.treasuries$.subscribe(t => {
      this.treasuries = t
      this.updateDerived()
      this.cdr.markForCheck()
    }))

    this.subs.add(this.marketData.cdxIndices$.subscribe(idx => {
      this.cdxIG = idx.find(c => c.name.includes('NA.IG') && c.tenor === '5Y') ?? null
      this.cdxHY = idx.find(c => c.name.includes('NA.HY')) ?? null
      this.cdr.markForCheck()
    }))
  }

  private updateDerived(): void {
    const tsy2Y  = this.treasuries.find(t => t.tenor === '2Y')
    const tsy5Y  = this.treasuries.find(t => t.tenor === '5Y')
    const tsy10Y = this.treasuries.find(t => t.tenor === '10Y')
    const tsy30Y = this.treasuries.find(t => t.tenor === '30Y')

    this.slope = tsy2Y && tsy10Y ? Math.round((tsy10Y.bidYield - tsy2Y.bidYield) * 100) : -34

    this.benchmarks = [
      { label: '2Y',  yield: tsy2Y  ? fmtYield(tsy2Y.bidYield)  : '—', chg: tsy2Y?.change != null  ? fmtChgBps(tsy2Y.change)  : null, chgVal: tsy2Y?.change  ?? 0 },
      { label: '5Y',  yield: tsy5Y  ? fmtYield(tsy5Y.bidYield)  : '—', chg: tsy5Y?.change != null  ? fmtChgBps(tsy5Y.change)  : null, chgVal: tsy5Y?.change  ?? 0 },
      { label: '10Y', yield: tsy10Y ? fmtYield(tsy10Y.bidYield) : '—', chg: tsy10Y?.change != null ? fmtChgBps(tsy10Y.change) : null, chgVal: tsy10Y?.change ?? 0 },
      { label: '30Y', yield: tsy30Y ? fmtYield(tsy30Y.bidYield) : '—', chg: tsy30Y?.change != null ? fmtChgBps(tsy30Y.change) : null, chgVal: tsy30Y?.change ?? 0 },
    ]
  }

  private updateTime(): void {
    const now = new Date()
    const h = parseInt(now.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/New_York' }))
    this.isOpen = h >= 8 && h < 17
    this.timeStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
    if (this.timeInterval) clearInterval(this.timeInterval)
  }
}
