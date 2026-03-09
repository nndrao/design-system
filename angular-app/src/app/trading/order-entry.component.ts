import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-order-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, Select, InputNumber, Dialog],
  template: `
    <div class="ds-panel ds-order-entry">
      <div class="ds-order-symbol">
        <span class="ds-bold">AAPL</span>
        <span class="ds-mono ds-muted">\$263.90</span>
      </div>

      <!-- Buy/Sell Toggle -->
      <div class="ds-toggle-group">
        <button
          class="ds-toggle-btn"
          [class.ds-toggle-buy]="side() === 'buy'"
          [class.ds-toggle-inactive]="side() !== 'buy'"
          (click)="side.set('buy')"
        >Buy</button>
        <button
          class="ds-toggle-btn"
          [class.ds-toggle-sell]="side() === 'sell'"
          [class.ds-toggle-inactive]="side() !== 'sell'"
          (click)="side.set('sell')"
        >Sell</button>
      </div>

      <!-- Order Type -->
      <div class="ds-field">
        <label class="ds-field-label">Order type</label>
        <p-select
          [options]="orderTypes"
          [(ngModel)]="orderType"
          [style]="{ width: '100%' }"
          size="small"
        />
      </div>

      <!-- Quantity -->
      <div class="ds-field">
        <label class="ds-field-label">Quantity</label>
        <p-inputNumber
          [(ngModel)]="quantity"
          [showButtons]="true"
          buttonLayout="horizontal"
          [min]="1"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          [style]="{ width: '100%' }"
          [inputStyle]="{ textAlign: 'center', fontFamily: 'var(--ds-font-mono)', fontSize: '0.75rem' }"
          size="small"
        />
      </div>

      <!-- Limit Price -->
      @if (orderType !== 'Market') {
        <div class="ds-field">
          <label class="ds-field-label">{{ orderType === 'Limit' ? 'Limit price' : 'Stop price' }}</label>
          <p-inputNumber
            [(ngModel)]="limitPrice"
            mode="currency"
            currency="USD"
            [minFractionDigits]="2"
            [maxFractionDigits]="2"
            [showButtons]="true"
            buttonLayout="horizontal"
            [step]="0.01"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            [style]="{ width: '100%' }"
            [inputStyle]="{ fontFamily: 'var(--ds-font-mono)', fontSize: '0.75rem' }"
            size="small"
          />
          <div class="ds-hint">Bid $263.82 · Ask $263.93</div>
        </div>
      }

      <!-- Time in Force -->
      <div class="ds-field">
        <label class="ds-field-label">Time in force</label>
        <p-select
          [options]="timeOptions"
          [(ngModel)]="timeInForce"
          [style]="{ width: '100%' }"
          size="small"
        />
      </div>

      <!-- Estimated Cost -->
      <div class="ds-cost-section">
        <div class="ds-cost-row">
          <span class="ds-sell-text ds-bold">Estimated cost</span>
          <span class="ds-mono ds-bold">{{ '$' + estimatedCost() }}</span>
        </div>
        <div class="ds-hint">Buying power $0.00</div>
      </div>

      <!-- Submit -->
      <p-button
        [label]="(side() === 'buy' ? 'Buy' : 'Sell') + ' AAPL'"
        [style]="{
          width: '100%',
          backgroundColor: side() === 'buy' ? 'var(--ds-buy)' : 'var(--ds-sell)',
          borderColor: side() === 'buy' ? 'var(--ds-buy)' : 'var(--ds-sell)',
          fontSize: '0.75rem'
        }"
        (onClick)="showConfirm.set(true)"
        size="small"
      />
    </div>

    <!-- Confirmation Dialog -->
    <p-dialog
      header="Confirm Order"
      [(visible)]="confirmVisible"
      [modal]="true"
      [style]="{ width: '20rem' }"
      [closable]="true"
    >
      <div class="ds-confirm-body">
        <div class="ds-confirm-row">
          <span class="ds-muted">Symbol</span>
          <span class="ds-bold">AAPL</span>
        </div>
        <div class="ds-confirm-row">
          <span class="ds-muted">Side</span>
          <span [class]="side() === 'buy' ? 'ds-buy-text ds-bold' : 'ds-sell-text ds-bold'">
            {{ side().toUpperCase() }}
          </span>
        </div>
        <div class="ds-confirm-row">
          <span class="ds-muted">Type</span>
          <span class="ds-bold">{{ orderType }}</span>
        </div>
        <div class="ds-confirm-row">
          <span class="ds-muted">Quantity</span>
          <span class="ds-mono">{{ quantity }}</span>
        </div>
        @if (orderType !== 'Market') {
          <div class="ds-confirm-row">
            <span class="ds-muted">Price</span>
            <span class="ds-mono">{{ '$' + limitPrice.toFixed(2) }}</span>
          </div>
        }
      </div>
      <ng-template #footer>
        <div class="ds-confirm-actions">
          <p-button label="Cancel" [text]="true" size="small" (onClick)="showConfirm.set(false)" />
          <p-button
            [label]="(side() === 'buy' ? 'Buy' : 'Sell') + ' AAPL'"
            [style]="{
              backgroundColor: side() === 'buy' ? 'var(--ds-buy)' : 'var(--ds-sell)',
              borderColor: side() === 'buy' ? 'var(--ds-buy)' : 'var(--ds-sell)'
            }"
            size="small"
            (onClick)="showConfirm.set(false)"
          />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host { display: block; height: 100%; width: 100%; overflow: auto; }
    .ds-order-entry { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .ds-order-symbol { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; }
    .ds-toggle-group {
      display: flex;
      border: 1px solid var(--ds-border);
      border-radius: 4px;
      overflow: hidden;
    }
    .ds-toggle-btn {
      flex: 1;
      padding: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.15s;
    }
    .ds-toggle-buy { background: var(--ds-buy); color: #1a1a22; }
    .ds-toggle-sell { background: var(--ds-sell); color: #fff; }
    .ds-toggle-inactive {
      background: var(--ds-secondary);
      color: var(--ds-muted-foreground);
    }
    .ds-toggle-inactive:hover { color: var(--ds-foreground); }
    .ds-field { display: flex; flex-direction: column; gap: 0.25rem; }
    .ds-field-label { font-size: 0.6875rem; color: var(--ds-muted-foreground); }
    .ds-cost-section {
      border-top: 1px solid var(--ds-border);
      padding-top: 0.5rem;
    }
    .ds-cost-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
    }
    .ds-mono { font-family: var(--ds-font-mono); }
    .ds-bold { font-weight: 500; }
    .ds-muted { color: var(--ds-muted-foreground); font-size: 0.75rem; }
    .ds-hint { font-size: 0.625rem; color: var(--ds-muted-foreground); margin-top: 0.125rem; }
    .ds-buy-text { color: var(--ds-buy); }
    .ds-sell-text { color: var(--ds-sell); }
    .ds-confirm-body { display: flex; flex-direction: column; gap: 0.5rem; }
    .ds-confirm-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
    }
    .ds-confirm-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .ds-panel {
      background: var(--ds-card);
      border: 1px solid var(--ds-border);
      border-radius: 4px;
    }
  `],
})
export class OrderEntryComponent {
  side = signal<'buy' | 'sell'>('buy');
  orderType = 'Limit';
  orderTypes = ['Market', 'Limit', 'Stop'];
  quantity = 1;
  limitPrice = 263.93;
  timeInForce = 'Good for day';
  timeOptions = ['Good for day', 'Good til canceled'];
  showConfirm = signal(false);

  get confirmVisible() { return this.showConfirm(); }
  set confirmVisible(v: boolean) { this.showConfirm.set(v); }

  estimatedCost(): string {
    return (this.quantity * this.limitPrice).toFixed(2);
  }
}
