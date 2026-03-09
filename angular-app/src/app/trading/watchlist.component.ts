import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { WATCHLIST_DATA, formatPrice, formatVolume, type WatchlistItem } from '../shared/mock-data';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <div class="ds-panel">
      <div class="ds-panel-header">
        <span class="ds-panel-title">First list</span>
      </div>
      <p-table
        [value]="data"
        [scrollable]="true"
        scrollHeight="flex"
        selectionMode="single"
        [(selection)]="selectedItem"
        dataKey="symbol"
        [rowHover]="true"
        styleClass="p-datatable-sm"
      >
        <ng-template #header>
          <tr>
            <th style="width: 2rem">#</th>
            <th pSortableColumn="symbol">Symbol <p-sortIcon field="symbol" /></th>
            <th pSortableColumn="change">Net chg <p-sortIcon field="change" /></th>
            <th pSortableColumn="changePct">Chg % <p-sortIcon field="changePct" /></th>
            <th pSortableColumn="last" style="text-align: right">Last <p-sortIcon field="last" /></th>
            <th pSortableColumn="volume" style="text-align: right">Volume <p-sortIcon field="volume" /></th>
          </tr>
        </ng-template>
        <ng-template #body let-item let-rowIndex="rowIndex">
          <tr [pSelectableRow]="item">
            <td class="ds-muted">{{ rowIndex + 1 }}</td>
            <td class="ds-bold">{{ item.symbol }}</td>
            <td [class]="getColorClass(item.change) + ' ds-mono'">
              {{ getArrow(item.change) }} {{ '$' + formatAbsChange(item.change) }}
            </td>
            <td [class]="getColorClass(item.changePct) + ' ds-mono'">
              {{ getArrow(item.changePct) }} {{ formatAbsPercent(item.changePct) }}
            </td>
            <td class="ds-mono" style="text-align: right">{{ '$' + formatPrice(item.last) }}</td>
            <td class="ds-mono ds-muted" style="text-align: right">{{ formatVolume(item.volume) }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; width: 100%; }
    .ds-panel {
      background: var(--ds-card);
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .ds-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--ds-border);
    }
    .ds-panel-title { font-size: 0.75rem; font-weight: 500; }
    .ds-mono { font-family: var(--ds-font-mono) !important; }
    .ds-bold { font-weight: 500; }
    .ds-muted { color: var(--ds-muted-foreground) !important; }
    .ds-buy-text { color: var(--ds-buy) !important; }
    .ds-sell-text { color: var(--ds-sell) !important; }
  `],
})
export class WatchlistComponent {
  data = WATCHLIST_DATA;
  selectedItem = signal<WatchlistItem | null>(WATCHLIST_DATA[0]);
  formatPrice = formatPrice;
  formatVolume = formatVolume;

  getColorClass(value: number): string {
    if (value > 0) return 'ds-buy-text';
    if (value < 0) return 'ds-sell-text';
    return 'ds-muted';
  }

  getArrow(value: number): string {
    return value < 0 ? '▼' : '▲';
  }

  formatAbsChange(value: number): string {
    return Math.abs(value).toFixed(2);
  }

  formatAbsPercent(value: number): string {
    return Math.abs(value).toFixed(2) + '%';
  }
}
