import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [Button],
  template: `
    <aside class="ds-sidebar">
      <div class="ds-sidebar-section">
        <div class="ds-label">Individual</div>
        <div class="ds-balance">$0.00</div>
        <div class="ds-pnl-row">
          <span class="ds-positive">▲ $0.00</span>
          <span class="ds-label">— Today</span>
        </div>
        <div class="ds-pnl-row">
          <span class="ds-positive">▲ $0.00</span>
          <span class="ds-label">— Overnight</span>
        </div>
      </div>
      <div class="ds-sidebar-section">
        <div class="ds-label">Overview</div>
        <div class="ds-stat-row">
          <span class="ds-label">Buying power</span>
          <span class="ds-mono">$0.00</span>
        </div>
      </div>
      <div class="ds-sidebar-section ds-sidebar-fill">
        <div class="ds-sidebar-watchlist-header">
          <span class="ds-text-sm">Watchlist</span>
          <p-button label="Deposit" size="small" />
        </div>
        <p class="ds-hint">Select a symbol from the watchlist to view details</p>
      </div>
    </aside>
  `,
  styles: [`
    .ds-sidebar {
      width: 12rem;
      border-right: 1px solid var(--ds-border);
      background: var(--ds-card);
      display: flex;
      flex-direction: column;
    }
    .ds-sidebar-section {
      padding: 0.75rem;
      border-bottom: 1px solid var(--ds-border);
    }
    .ds-sidebar-fill { flex: 1; border-bottom: none; }
    .ds-label { font-size: 0.6875rem; color: var(--ds-muted-foreground); }
    .ds-balance { font-size: 1.125rem; font-weight: 600; font-family: var(--ds-font-mono); }
    .ds-pnl-row { display: flex; align-items: center; gap: 0.5rem; }
    .ds-positive { font-size: 0.6875rem; color: var(--ds-buy); }
    .ds-stat-row {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }
    .ds-mono { font-size: 0.6875rem; font-family: var(--ds-font-mono); }
    .ds-text-sm { font-size: 0.75rem; font-weight: 500; }
    .ds-sidebar-watchlist-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .ds-hint { font-size: 0.625rem; color: var(--ds-muted-foreground); margin: 0; }
  `],
})
export class SidebarComponent {}
