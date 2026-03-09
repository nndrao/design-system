import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHART_DATA } from '../shared/mock-data';

@Component({
  selector: 'app-chart-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-panel ds-chart-panel">
      <!-- Header -->
      <div class="ds-chart-header">
        <div class="ds-chart-symbol">
          <span class="ds-bold">AAPL</span>
          <span class="ds-mono">\$263.90</span>
          <span class="ds-sell-text ds-mono">▼ $0.82 (-0.31%)</span>
        </div>
      </div>

      <!-- Chart SVG -->
      <div class="ds-chart-area">
        <svg [attr.viewBox]="'0 0 ' + chartWidth + ' ' + chartHeight" class="ds-chart-svg" preserveAspectRatio="none">
          <!-- Grid lines -->
          @for (y of gridLines; track y) {
            <line [attr.x1]="0" [attr.y1]="y" [attr.x2]="chartWidth" [attr.y2]="y"
              stroke="var(--ds-border)" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.5"/>
          }

          <!-- Area gradient -->
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--ds-buy)" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="var(--ds-buy)" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <!-- Area fill -->
          <path [attr.d]="areaPath" fill="url(#areaGrad)"/>

          <!-- Line -->
          <path [attr.d]="linePath" fill="none" stroke="var(--ds-buy)" stroke-width="1.5"/>
        </svg>

        <!-- Y-axis labels -->
        <div class="ds-chart-y-axis">
          @for (label of yLabels; track label.value) {
            <span class="ds-chart-label" [style.top.%]="label.pct">
              {{ '$' + label.value.toFixed(0) }}
            </span>
          }
        </div>

        <!-- X-axis labels -->
        <div class="ds-chart-x-axis">
          @for (label of xLabels; track label.time) {
            <span class="ds-chart-label" [style.left.%]="label.pct">
              {{ label.time }}
            </span>
          }
        </div>
      </div>

      <!-- Timeframe Selector -->
      <div class="ds-chart-timeframes">
        @for (tf of timeframes; track tf) {
          <button
            class="ds-tf-btn"
            [class.ds-tf-active]="activeTimeframe() === tf"
            (click)="activeTimeframe.set(tf)"
          >{{ tf }}</button>
        }
        <span class="ds-spacer"></span>
        <span class="ds-chart-label">Interval: 5m</span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; width: 100%; }
    .ds-panel {
      background: var(--ds-card);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .ds-chart-panel { height: 100%; }
    .ds-chart-header {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--ds-border);
    }
    .ds-chart-symbol {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
    }
    .ds-bold { font-weight: 600; }
    .ds-mono { font-family: var(--ds-font-mono); font-size: 0.75rem; }
    .ds-sell-text { color: var(--ds-sell); }
    .ds-chart-area {
      flex: 1;
      position: relative;
      padding: 0.5rem 3rem 1.5rem 0.5rem;
      min-height: 180px;
    }
    .ds-chart-svg {
      width: 100%;
      height: 100%;
    }
    .ds-chart-y-axis {
      position: absolute;
      right: 0;
      top: 0.5rem;
      bottom: 1.5rem;
      width: 3rem;
    }
    .ds-chart-x-axis {
      position: absolute;
      bottom: 0;
      left: 0.5rem;
      right: 3rem;
      height: 1.5rem;
    }
    .ds-chart-label {
      position: absolute;
      font-size: 0.625rem;
      color: var(--ds-muted-foreground);
      font-family: var(--ds-font-mono);
    }
    .ds-chart-timeframes {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.625rem 0.75rem;
      border-top: 1px solid var(--ds-border);
    }
    .ds-tf-btn {
      padding: 0.125rem 0.5rem;
      font-size: 0.625rem;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      background: transparent;
      color: var(--ds-muted-foreground);
      transition: all 0.15s;
    }
    .ds-tf-btn:hover { color: var(--ds-foreground); background: var(--ds-secondary); }
    .ds-tf-active {
      background: var(--p-primary-color) !important;
      color: var(--p-primary-contrast-color) !important;
    }
    .ds-spacer { flex: 1; }
  `],
})
export class ChartPanelComponent {
  timeframes = ['1D', '1W', '1M', '3M', 'YTD', '1Y', '5Y', 'All'];
  activeTimeframe = signal('1D');

  chartWidth = 600;
  chartHeight = 200;

  private data = CHART_DATA;
  private minClose = Math.min(...this.data.map(d => d.close)) - 0.5;
  private maxClose = Math.max(...this.data.map(d => d.close)) + 0.5;

  get linePath(): string {
    return this.data.map((d, i) => {
      const x = (i / (this.data.length - 1)) * this.chartWidth;
      const y = this.chartHeight - ((d.close - this.minClose) / (this.maxClose - this.minClose)) * this.chartHeight;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }

  get areaPath(): string {
    const line = this.data.map((d, i) => {
      const x = (i / (this.data.length - 1)) * this.chartWidth;
      const y = this.chartHeight - ((d.close - this.minClose) / (this.maxClose - this.minClose)) * this.chartHeight;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    return `${line} L${this.chartWidth},${this.chartHeight} L0,${this.chartHeight} Z`;
  }

  get gridLines(): number[] {
    return [0, this.chartHeight * 0.25, this.chartHeight * 0.5, this.chartHeight * 0.75, this.chartHeight];
  }

  get yLabels(): { value: number; pct: number }[] {
    return [0, 25, 50, 75, 100].map(pct => ({
      value: this.maxClose - (pct / 100) * (this.maxClose - this.minClose),
      pct,
    }));
  }

  get xLabels(): { time: string; pct: number }[] {
    return this.data
      .filter((_, i) => i % 3 === 0)
      .map(d => ({
        time: d.time,
        pct: (this.data.indexOf(d) / (this.data.length - 1)) * 100,
      }));
  }
}
