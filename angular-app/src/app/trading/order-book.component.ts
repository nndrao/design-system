import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ORDER_BOOK_BIDS, ORDER_BOOK_ASKS, formatPrice } from '../shared/mock-data';

@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-panel">
      <div class="ds-panel-header">
        <span class="ds-panel-title">Order Book</span>
      </div>

      <!-- Column Headers -->
      <div class="ds-book-header">
        <span>Size</span>
        <span class="ds-center">Price</span>
        <span class="ds-right">Size</span>
      </div>

      <!-- Book Rows -->
      <div class="ds-book-body">
        @for (bid of bids; let i = $index; track i) {
          <div class="ds-book-row">
            <div class="ds-book-cell ds-bid-cell">
              <div class="ds-bar ds-bid-bar" [style.width.%]="bidPct(bid.size)"></div>
              <span class="ds-muted">{{ bid.size | number }}</span>
            </div>
            <div class="ds-book-cell ds-prices">
              <span class="ds-buy-text">{{ '$' + formatPrice(bid.price) }}</span>
              @if (asks[i]) {
                <span class="ds-sell-text">{{ '$' + formatPrice(asks[i].price) }}</span>
              }
            </div>
            <div class="ds-book-cell ds-ask-cell">
              @if (asks[i]) {
                <div class="ds-bar ds-ask-bar" [style.width.%]="askPct(asks[i].size)"></div>
                <span class="ds-muted">{{ asks[i].size | number }}</span>
              }
            </div>
          </div>
        }
      </div>

      <!-- Spread -->
      <div class="ds-book-footer">
        <span>Spread: $0.02</span>
        <span>Mid: $263.89</span>
      </div>
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
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--ds-border);
    }
    .ds-panel-title { font-size: 0.75rem; font-weight: 500; }
    .ds-book-header {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      padding: 0.25rem 0.75rem;
      font-size: 0.625rem;
      color: var(--ds-muted-foreground);
      border-bottom: 1px solid var(--ds-border);
    }
    .ds-center { text-align: center; }
    .ds-right { text-align: right; }
    .ds-book-body { font-family: var(--ds-font-mono); font-size: 0.6875rem; flex: 1; overflow: auto; }
    .ds-book-row {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      padding: 0.125rem 0.75rem;
      align-items: center;
    }
    .ds-book-cell { position: relative; }
    .ds-bid-cell { }
    .ds-ask-cell { text-align: right; }
    .ds-prices {
      display: flex;
      justify-content: space-between;
      padding: 0 0.25rem;
    }
    .ds-bar {
      position: absolute;
      top: 0;
      bottom: 0;
    }
    .ds-bid-bar { right: 0; background: var(--ds-buy-muted); }
    .ds-ask-bar { left: 0; background: var(--ds-sell-muted); }
    .ds-muted { color: var(--ds-muted-foreground); position: relative; }
    .ds-buy-text { color: var(--ds-buy); }
    .ds-sell-text { color: var(--ds-sell); }
    .ds-book-footer {
      display: flex;
      justify-content: space-between;
      padding: 0.375rem 0.75rem;
      border-top: 1px solid var(--ds-border);
      font-size: 0.625rem;
      color: var(--ds-muted-foreground);
    }
  `],
})
export class OrderBookComponent {
  bids = ORDER_BOOK_BIDS;
  asks = ORDER_BOOK_ASKS;
  formatPrice = formatPrice;

  private maxBid = Math.max(...this.bids.map(b => b.size));
  private maxAsk = Math.max(...this.asks.map(a => a.size));

  bidPct(size: number): number { return (size / this.maxBid) * 100; }
  askPct(size: number): number { return (size / this.maxAsk) * 100; }
}
