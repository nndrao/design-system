import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { POSITIONS_DATA, formatPrice } from '../shared/mock-data';

@Component({
  selector: 'app-positions-table',
  standalone: true,
  imports: [CommonModule, TableModule, Button],
  template: `
    <div class="ds-panel">
      <div class="ds-panel-header">
        <span class="ds-panel-title">Positions</span>
        <span class="ds-hint">{{ data.length }} open</span>
      </div>
      <p-table
        [value]="data"
        [rowHover]="true"
        styleClass="p-datatable-sm ds-compact-table"
      >
        <ng-template #header>
          <tr>
            <th>Symbol</th>
            <th>Side</th>
            <th style="text-align: right">Qty</th>
            <th style="text-align: right">Entry</th>
            <th style="text-align: right">Current</th>
            <th style="text-align: right">P&L</th>
            <th style="width: 2.5rem"></th>
          </tr>
        </ng-template>
        <ng-template #body let-pos>
          <tr>
            <td class="ds-bold">{{ pos.symbol }}</td>
            <td>
              <span
                class="ds-side-badge"
                [class.ds-badge-buy]="pos.side === 'BUY'"
                [class.ds-badge-sell]="pos.side === 'SELL'"
              >{{ pos.side }}</span>
            </td>
            <td class="ds-mono ds-right">{{ pos.qty }}</td>
            <td class="ds-mono ds-right">{{ '$' + formatPrice(pos.entry) }}</td>
            <td class="ds-mono ds-right">{{ '$' + formatPrice(pos.current) }}</td>
            <td
              class="ds-mono ds-right ds-bold"
              [class.ds-buy-text]="pos.pnl >= 0"
              [class.ds-sell-text]="pos.pnl < 0"
            >
              {{ pos.pnl >= 0 ? '+' : '' }}{{ '$' + formatPrice(pos.pnl) }}
            </td>
            <td style="text-align: center">
              <p-button icon="pi pi-times" [text]="true" [rounded]="true" size="small" severity="danger" />
            </td>
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
    .ds-hint { font-size: 0.625rem; color: var(--ds-muted-foreground); }
    .ds-mono { font-family: var(--ds-font-mono); }
    .ds-bold { font-weight: 500; }
    .ds-right { text-align: right; }
    .ds-buy-text { color: var(--ds-buy); }
    .ds-sell-text { color: var(--ds-sell); }
    .ds-side-badge {
      display: inline-block;
      padding: 0.125rem 0.375rem;
      border-radius: 2px;
      font-size: 0.625rem;
      font-weight: 600;
    }
    .ds-badge-buy { background: var(--ds-buy-muted); color: var(--ds-buy); }
    .ds-badge-sell { background: var(--ds-sell-muted); color: var(--ds-sell); }
    :host ::ng-deep .ds-compact-table {
      .p-datatable-thead > tr > th {
        font-size: 0.6875rem;
        padding: 0.375rem 0.75rem;
      }
      .p-datatable-tbody > tr > td {
        font-size: 0.75rem;
        padding: 0.375rem 0.75rem;
      }
    }
  `],
})
export class PositionsTableComponent {
  data = POSITIONS_DATA;
  formatPrice = formatPrice;
}
