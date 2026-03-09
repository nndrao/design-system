import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, ViewChild, TemplateRef, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AgGridAngular } from 'ag-grid-angular'
import { AllEnterpriseModule, ModuleRegistry } from 'ag-grid-enterprise'
import type { ColDef, RowClickedEvent, GridReadyEvent, StatusPanelDef } from 'ag-grid-community'
import { Dialog, DialogRef } from '@angular/cdk/dialog'
import { OverlayModule } from '@angular/cdk/overlay'
import { marketsUITheme } from '../ag-grid-theme'
import { BASE_ORDERS, BASE_TREASURIES, BASE_CORP_BONDS, fmtYield, fmtPrice, type Order } from '../market-data.service'

ModuleRegistry.registerModules([AllEnterpriseModule])

type StatusFilter = 'All' | Order['status']
const STATUS_FILTERS: StatusFilter[] = ['All', 'Working', 'Partial', 'Filled', 'Cancelled']

const ACCOUNTS       = ['RATES-01', 'RATES-02', 'CREDIT-01', 'CREDIT-02', 'MACRO-01']
const COUNTERPARTIES = ['JPMorgan', 'Goldman Sachs', 'Barclays', 'Citigroup', 'Morgan Stanley', 'Deutsche Bank', 'Bank of America', 'UBS', 'CME Globex']
const VENUES         = ['TradeWeb', 'MarketAxess', 'Bloomberg', 'CME Globex', 'Direct']
const TIF            = ['Day', 'GTC', 'IOC', 'FOK']

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  Filled:    { bg: 'rgba(0,163,108,0.15)',  color: 'var(--ds-buy)',             border: '1px solid rgba(0,163,108,0.3)'  },
  Working:   { bg: 'rgba(22,82,240,0.15)',  color: 'var(--ds-primary)',         border: '1px solid rgba(22,82,240,0.3)'  },
  Partial:   { bg: 'rgba(217,119,6,0.15)',  color: 'var(--ds-warning)',         border: '1px solid rgba(217,119,6,0.3)'  },
  Cancelled: { bg: 'var(--ds-secondary)',   color: 'var(--ds-muted-foreground)', border: '1px solid var(--ds-border)'    },
}

const SECURITY_LIST = [
  ...BASE_TREASURIES.map(t => ({ label: t.label, cusip: t.cusip, type: 'Treasury', yield: t.bidYield, price: t.bidPrice })),
  ...BASE_CORP_BONDS.map(b => ({ label: b.description, cusip: b.cusip, type: b.isHY ? 'High Yield' : 'IG Corporate', yield: b.bidYield, price: b.bidPrice })),
]

@Component({
  selector: 'app-blotter-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, AgGridAngular, OverlayModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">

      <!-- Main Blotter -->
      <div class="main-blotter">

        <!-- Toolbar -->
        <div class="toolbar">
          <div class="filter-btns">
            @for (s of statusFilters; track s) {
              <button class="filter-btn" [class.active]="filter === s" (click)="setFilter(s)">
                {{ s }}
                @if (s !== 'All' && counts[s] > 0) { <span class="count">{{ counts[s] }}</span> }
              </button>
            }
          </div>
          <div class="toolbar-right">
            <span class="muted small">{{ rowData.length }} orders · Today</span>
            <button class="new-order-btn" (click)="openTicket()">+ New Order</button>
          </div>
        </div>

        <!-- Grid -->
        <div class="grid-area">
          <ag-grid-angular
            [theme]="theme" [rowData]="rowData" [columnDefs]="colDefs" [defaultColDef]="defaultColDef"
            [rowHeight]="40" [headerHeight]="30" [rowSelection]="rowSel" (rowClicked)="onRowClicked($event)"
            (gridReady)="onGridReady($event)" [suppressCellFocus]="true" [enableCellTextSelection]="true"
            [sideBar]="sideBar" [statusBar]="statusBar"
            style="height:100%;width:100%"
          />
        </div>
      </div>

      <!-- Detail Sidebar -->
      @if (selected) {
        <div class="detail-sidebar">
          <div class="detail-header">
            <div>
              <div class="detail-title">{{ selected.security }}</div>
              <div class="detail-desc">{{ selected.description }}</div>
            </div>
            <button class="close-btn" (click)="selected = null; cdr.markForCheck()">×</button>
          </div>
          <div class="detail-body">
            <div class="side-box" [class.buy-box]="selected.side === 'Buy'" [class.sell-box]="selected.side === 'Sell'">
              <div class="side-box-label">{{ selected.side === 'Buy' ? 'Buy Order' : 'Sell Order' }}</div>
              <div class="side-box-value" [class.buy]="selected.side === 'Buy'" [class.sell]="selected.side === 'Sell'">
                {{ '$' + selected.faceValueMM + 'MM' }}
              </div>
            </div>
            <div class="detail-grid">
              @for (row of detailMeta; track row[0]) {
                <div class="detail-field">
                  <div class="field-label">{{ row[0] }}</div>
                  <div class="field-val" [class.buy]="row[0] === 'Side' && row[1] === 'Buy'" [class.sell]="row[0] === 'Side' && row[1] === 'Sell'">{{ row[1] }}</div>
                </div>
              }
            </div>
            <div class="detail-section">
              <div class="section-title">Execution</div>
              @for (row of detailExec; track row[0]) {
                <div class="detail-row">
                  <span class="muted">{{ row[0] }}</span>
                  <span class="mono">{{ row[1] }}</span>
                </div>
              }
              <div class="fill-bar-wrap">
                <div class="fill-bar-track">
                  <div class="fill-bar-fill"
                    [class.fill-buy]="fillPct >= 100"
                    [class.fill-primary]="fillPct > 0 && fillPct < 100"
                    [class.fill-muted]="fillPct === 0"
                    [style.width.%]="fillPct">
                  </div>
                </div>
                <span class="mono small muted fill-pct">{{ fillPct.toFixed(0) }}%</span>
              </div>
            </div>
            <div class="detail-section">
              <div class="section-title">Settlement</div>
              @for (row of detailSettle; track row[0]) {
                <div class="detail-row">
                  <span class="muted">{{ row[0] }}</span>
                  <span class="mono">{{ row[1] }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>

    <!-- CDK Order Ticket Dialog Template -->
    <ng-template #ticketTpl>
      <div class="cdk-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="ticket-title">
        <div class="cdk-dialog-header">
          <h2 class="cdk-dialog-title" id="ticket-title">New Order</h2>
          <button class="cdk-close-btn" (click)="closeTicket()" aria-label="Close">×</button>
        </div>
        <div class="ticket-body">
          <!-- Side toggle -->
          <div class="side-toggle">
            <button class="side-btn" [class.buy-active]="ticketSide === 'Buy'" (click)="ticketSide='Buy'">Buy / Long</button>
            <button class="side-btn" [class.sell-active]="ticketSide === 'Sell'" (click)="ticketSide='Sell'">Sell / Short</button>
          </div>

          <!-- Security search -->
          <div class="field-group" style="position:relative">
            <label class="field-label-sm">Security</label>
            <div style="position:relative">
              <span class="search-icon">⌕</span>
              <input [(ngModel)]="secSearch" (focus)="showSecList=true" (input)="showSecList=true" placeholder="Search CUSIP, Ticker, Description..." class="ticket-input pl-search" />
            </div>
            @if (showSecList && secSearch && getFilteredSec().length > 0) {
              <div class="sec-dropdown">
                @for (s of getFilteredSec(); track s.cusip) {
                  <button class="sec-item" (click)="selectSec(s)">
                    <div class="sec-item-top">
                      <span class="mono small-bold">{{ s.label }}</span>
                      <span class="sec-type" [class.treasury-type]="s.type === 'Treasury'" [class.hy-type]="s.type === 'High Yield'" [class.ig-type]="s.type !== 'Treasury' && s.type !== 'High Yield'">{{ s.type }}</span>
                    </div>
                    <div class="sec-item-info">
                      <span>CUSIP: {{ s.cusip }}</span>
                      <span>Yield: {{ s.yield.toFixed(3) }}%</span>
                      <span>Price: {{ s.price.toFixed(3) }}</span>
                    </div>
                  </button>
                }
              </div>
            }
            @if (selectedSec) {
              <div class="sec-info-row">
                <span>CUSIP: {{ selectedSec.cusip }}</span>
                <span>Mid Yield: {{ selectedSec.yield.toFixed(3) }}%</span>
                <span>Price: {{ selectedSec.price.toFixed(3) }}</span>
              </div>
            }
          </div>

          <!-- Face value + Limit -->
          <div class="two-col">
            <div class="field-group">
              <label class="field-label-sm">Face Value ($MM)</label>
              <input type="number" [(ngModel)]="faceValue" min="1" class="ticket-input mono" />
              <div class="field-hint">Notional: {{ '$' + (+(faceValue || 0) * 1_000_000).toLocaleString() }}</div>
            </div>
            <div class="field-group">
              <div class="flex-label">
                <label class="field-label-sm">Limit {{ priceMode === 'yield' ? 'Yield' : 'Price' }}</label>
                <button class="mode-toggle" (click)="priceMode = priceMode === 'yield' ? 'price' : 'yield'">→ {{ priceMode === 'yield' ? 'Price' : 'Yield' }}</button>
              </div>
              <input type="number" step="0.001" [(ngModel)]="limitVal" [placeholder]="priceMode === 'yield' ? '4.380' : '98.875'" class="ticket-input mono" />
              <div class="field-hint">{{ priceMode === 'yield' ? 'Enter yield in %' : 'Enter clean price' }}</div>
            </div>
          </div>

          <!-- Execution details -->
          <div class="two-col">
            <div class="field-group">
              <label class="field-label-sm">Account</label>
              <select [(ngModel)]="account" class="ticket-select">@for (o of accounts; track o) { <option>{{ o }}</option> }</select>
            </div>
            <div class="field-group">
              <label class="field-label-sm">Counterparty</label>
              <select [(ngModel)]="cpty" class="ticket-select">@for (o of counterparties; track o) { <option>{{ o }}</option> }</select>
            </div>
            <div class="field-group">
              <label class="field-label-sm">Venue</label>
              <select [(ngModel)]="venue" class="ticket-select">@for (o of venues; track o) { <option>{{ o }}</option> }</select>
            </div>
            <div class="field-group">
              <label class="field-label-sm">Time-in-Force</label>
              <select [(ngModel)]="tif" class="ticket-select">@for (o of tifs; track o) { <option>{{ o }}</option> }</select>
            </div>
          </div>

          <!-- Settlement -->
          <div class="field-group">
            <label class="field-label-sm">Settlement</label>
            <div class="settle-btns">
              @for (s of ['T+1','T+2','T+3','T+5']; track s) {
                <button class="settle-btn" [class.active]="settleDate === s" (click)="settleDate=s">{{ s }}</button>
              }
            </div>
          </div>

          @if (selectedSec) {
            <div class="order-summary" [class.buy-summary]="ticketSide === 'Buy'" [class.sell-summary]="ticketSide === 'Sell'">
              <div class="summary-title">Order Summary</div>
              <div class="summary-grid mono">
                <span>{{ ticketSide }} {{ faceValue }}MM</span>
                <span style="overflow:hidden;text-overflow:ellipsis">{{ selectedSec.label }}</span>
                <span>Limit: {{ limitVal || '—' }}{{ priceMode === 'yield' ? '%' : '' }}</span>
                <span>Settle: {{ settleDate }}</span>
                <span>Via: {{ venue }}</span>
                <span>TIF: {{ tif }}</span>
              </div>
            </div>
          }
        </div>
        <div class="ticket-footer">
          <button class="cancel-btn" (click)="closeTicket()">Cancel</button>
          <button class="submit-btn" [class.buy-submit]="ticketSide === 'Buy'" [class.sell-submit]="ticketSide === 'Sell'" [disabled]="!selectedSec || submitted" (click)="submitOrder()">
            {{ submitted ? '✓ Order Submitted' : 'Submit ' + ticketSide + ' Order' }}
          </button>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host { display: flex; height: 100%; overflow: hidden; }
    .panel { display: flex; height: 100%; overflow: hidden; width: 100%; }

    /* Main blotter */
    .main-blotter { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; border-bottom: 1px solid var(--ds-border); background: var(--ds-card); flex-shrink: 0; }
    .filter-btns { display: flex; gap: 4px; }
    .filter-btn { padding: 0.25rem 0.625rem; border-radius: 6px; font-size: 0.75rem; font-weight: 500; background: none; border: none; color: var(--ds-muted-foreground); cursor: pointer; transition: color 0.1s, background 0.1s; }
    .filter-btn.active { background: var(--ds-accent); color: var(--ds-foreground); }
    .filter-btn:hover:not(.active) { color: var(--ds-foreground); background: var(--ds-secondary); }
    .count { font-size: 10px; margin-left: 4px; opacity: 0.6; }
    .toolbar-right { display: flex; align-items: center; gap: 0.5rem; }
    .new-order-btn { display: flex; align-items: center; gap: 4px; padding: 0.375rem 0.75rem; background: var(--ds-primary); color: var(--ds-primary-foreground); border: none; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: opacity 0.1s; }
    .new-order-btn:hover { opacity: 0.9; }
    .grid-area { flex: 1; min-height: 0; padding: 0.75rem; }

    /* Detail sidebar */
    .detail-sidebar { width: 256px; border-left: 1px solid var(--ds-border); background: var(--ds-card); display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
    .detail-header { padding: 1rem; border-bottom: 1px solid var(--ds-border); display: flex; align-items: flex-start; justify-content: space-between; flex-shrink: 0; }
    .detail-title { font-weight: 600; font-size: 0.875rem; line-height: 1.3; }
    .detail-desc { font-size: 10px; color: var(--ds-muted-foreground); font-family: var(--ds-font-mono); margin-top: 2px; }
    .close-btn { background: none; border: none; color: var(--ds-muted-foreground); cursor: pointer; font-size: 1rem; padding: 0 4px; flex-shrink: 0; line-height: 1; }
    .detail-body { flex: 1; overflow-y: auto; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem; font-size: 11px; }
    .side-box { padding: 0.625rem 0.75rem; border-radius: 8px; }
    .buy-box  { background: rgba(0,163,108,0.1); }
    .sell-box { background: rgba(207,32,47,0.1); }
    .side-box-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ds-muted-foreground); margin-bottom: 2px; }
    .side-box-value { font-size: 1.25rem; font-weight: 600; font-family: var(--ds-font-mono); }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 0.5rem; }
    .detail-field .field-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ds-muted-foreground); margin-bottom: 2px; }
    .detail-field .field-val { font-family: var(--ds-font-mono); font-weight: 500; }
    .detail-section { border-top: 1px solid var(--ds-border); padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ds-muted-foreground); margin-bottom: 4px; }
    .detail-row { display: flex; justify-content: space-between; }
    .fill-bar-wrap { display: flex; align-items: center; gap: 0.5rem; margin-top: 4px; }
    .fill-bar-track { flex: 1; height: 4px; background: var(--ds-secondary); border-radius: 9999px; overflow: hidden; }
    .fill-bar-fill { height: 100%; border-radius: 9999px; }
    .fill-bar-fill.fill-buy     { background: var(--ds-buy); }
    .fill-bar-fill.fill-primary { background: var(--ds-primary); }
    .fill-bar-fill.fill-muted   { background: var(--ds-secondary); }
    .fill-pct { width: 2rem; text-align: right; }

    .muted { color: var(--ds-muted-foreground); }
    .small { font-size: 10px; }
    .mono  { font-family: var(--ds-font-mono); }
    .buy   { color: var(--ds-buy); }
    .sell  { color: var(--ds-sell); }

    /* CDK Dialog panel */
    .cdk-dialog-panel {
      width: 480px; max-height: 90vh;
      background: var(--ds-card); color: var(--ds-foreground);
      border: 1px solid var(--ds-border); border-radius: 16px;
      box-shadow: 0 24px 48px rgba(0,0,0,0.4);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: Inter, sans-serif; font-size: 0.875rem;
    }
    .cdk-dialog-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.25rem; border-bottom: 1px solid var(--ds-border); flex-shrink: 0;
    }
    .cdk-dialog-title { margin: 0; font-size: 1rem; font-weight: 600; }
    .cdk-close-btn { background: none; border: none; color: var(--ds-muted-foreground); cursor: pointer; font-size: 1.375rem; line-height: 1; padding: 0 4px; }
    .cdk-close-btn:hover { color: var(--ds-foreground); }
    .cdk-overlay-backdrop.order-ticket-backdrop { background: rgba(0,0,0,0.5); }

    /* Ticket form */
    .ticket-body { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem 1.25rem; overflow-y: auto; }
    .side-toggle { display: flex; background: var(--ds-secondary); border: 1px solid var(--ds-border); border-radius: 9999px; padding: 2px; }
    .side-btn { flex: 1; padding: 0.5rem; border-radius: 9999px; border: none; background: none; font-size: 0.875rem; font-weight: 600; cursor: pointer; color: var(--ds-muted-foreground); transition: all 0.15s; }
    .side-btn.buy-active  { background: var(--ds-buy); color: white; }
    .side-btn.sell-active { background: var(--ds-sell); color: white; }
    .field-group { display: flex; flex-direction: column; gap: 4px; }
    .field-label-sm { font-size: 11px; color: var(--ds-muted-foreground); text-transform: uppercase; letter-spacing: 0.04em; }
    .field-hint { font-size: 10px; color: var(--ds-muted-foreground); padding: 0 4px; }
    .flex-label { display: flex; justify-content: space-between; align-items: center; }
    .mode-toggle { background: none; border: none; color: var(--ds-primary); font-size: 10px; cursor: pointer; }
    .ticket-input { width: 100%; padding: 0.375rem 0.75rem; background: var(--ds-input, var(--ds-secondary)); border: 1px solid var(--ds-border); border-radius: 8px; font-size: 0.875rem; color: var(--ds-foreground); outline: none; box-sizing: border-box; }
    .pl-search { padding-left: 2rem; }
    .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--ds-muted-foreground); pointer-events: none; }
    .ticket-select { width: 100%; padding: 0.375rem 0.75rem; background: var(--ds-input, var(--ds-secondary)); border: 1px solid var(--ds-border); border-radius: 8px; font-size: 0.75rem; color: var(--ds-foreground); outline: none; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .settle-btns { display: flex; gap: 6px; }
    .settle-btn { flex: 1; padding: 0.25rem; border-radius: 6px; font-size: 0.75rem; font-family: var(--ds-font-mono); font-weight: 500; border: 1px solid var(--ds-border); background: none; color: var(--ds-muted-foreground); cursor: pointer; }
    .settle-btn.active { background: var(--ds-primary); color: white; border-color: var(--ds-primary); }
    .sec-dropdown { position: absolute; z-index: 10; width: 100%; background: var(--ds-card); border: 1px solid var(--ds-border); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-top: 4px; max-height: 11rem; overflow-y: auto; }
    .sec-item { width: 100%; text-align: left; padding: 0.375rem 0.75rem; background: none; border: none; border-bottom: 1px solid var(--ds-border); cursor: pointer; }
    .sec-item:hover { background: var(--ds-secondary); }
    .sec-item:last-child { border-bottom: none; }
    .sec-item-top { display: flex; align-items: center; justify-content: space-between; }
    .small-bold { font-size: 0.75rem; font-weight: 500; }
    .sec-item-info { display: flex; gap: 1rem; font-size: 10px; color: var(--ds-muted-foreground); font-family: var(--ds-font-mono); margin-top: 2px; }
    .sec-type { font-size: 10px; padding: 1px 6px; border-radius: 4px; font-weight: 500; }
    .treasury-type { background: rgba(22,82,240,0.15); color: var(--ds-primary); }
    .hy-type { background: rgba(207,32,47,0.15); color: var(--ds-sell); }
    .ig-type { background: rgba(0,163,108,0.15); color: var(--ds-buy); }
    .sec-info-row { display: flex; gap: 1rem; font-size: 10px; color: var(--ds-muted-foreground); font-family: var(--ds-font-mono); padding: 2px 4px; }
    .order-summary { padding: 0.625rem 0.75rem; border-radius: 8px; font-size: 11px; }
    .buy-summary  { background: rgba(0,163,108,0.08); border: 1px solid rgba(0,163,108,0.2); }
    .sell-summary { background: rgba(207,32,47,0.08);  border: 1px solid rgba(207,32,47,0.2); }
    .summary-title { font-weight: 600; margin-bottom: 4px; font-size: 0.75rem; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 1rem; color: var(--ds-muted-foreground); font-size: 11px; }
    .ticket-footer { display: flex; gap: 0.5rem; padding: 0.75rem 1.25rem; border-top: 1px solid var(--ds-border); flex-shrink: 0; }
    .cancel-btn { padding: 0.5rem 1rem; border: 1px solid var(--ds-border); border-radius: 9999px; background: none; font-size: 0.875rem; color: var(--ds-muted-foreground); cursor: pointer; }
    .submit-btn { flex: 1; padding: 0.5rem; border-radius: 9999px; border: none; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
    .buy-submit  { background: var(--ds-buy); color: white; }
    .sell-submit { background: var(--ds-sell); color: white; }
    .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `],
})
export class BlotterPanelComponent implements OnInit {
  readonly theme = marketsUITheme
  readonly rowSel = { mode: 'singleRow' as const, checkboxes: false, enableClickSelection: true }
  readonly statusFilters = STATUS_FILTERS
  readonly accounts = ACCOUNTS
  readonly counterparties = COUNTERPARTIES
  readonly venues = VENUES
  readonly tifs = TIF
  readonly sideBar = { toolPanels: ['columns', 'filters'], hiddenByDefault: true }
  readonly statusBar = { statusPanels: [
    { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' } as StatusPanelDef,
    { statusPanel: 'agSelectedRowCountComponent', align: 'left' } as StatusPanelDef,
  ] }

  filter: StatusFilter = 'All'
  rowData: Order[] = BASE_ORDERS
  counts: Record<string, number> = {}
  selected: Order | null = null

  // Detail computed
  detailMeta: [string, string][] = []
  detailExec: [string, string][] = []
  detailSettle: [string, string][] = []
  fillPct = 0

  // Ticket state
  ticketSide: 'Buy' | 'Sell' = 'Buy'
  secSearch = ''
  selectedSec: typeof SECURITY_LIST[0] | null = null
  showSecList = false
  priceMode: 'yield' | 'price' = 'yield'
  faceValue = '10'
  limitVal = ''
  account = ACCOUNTS[0]
  cpty = COUNTERPARTIES[0]
  venue = VENUES[0]
  tif = TIF[0]
  settleDate = 'T+1'
  submitted = false

  @ViewChild('ticketTpl') private ticketTpl!: TemplateRef<void>
  private dialogRef: DialogRef<unknown, void> | null = null
  private readonly cdkDialog = inject(Dialog)

  colDefs: ColDef<Order>[] = [
    { field: 'id',          headerName: 'Order ID',  width: 90,  cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }), filter: 'agTextColumnFilter' },
    { field: 'time',        headerName: 'Time',      width: 68,  cellClass: 'font-mono' },
    { field: 'security',    headerName: 'Security',  width: 160, filter: 'agTextColumnFilter',
      cellRenderer: (p: any) => `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;gap:2px"><div style="font-weight:500;font-size:11px">${p.data?.security ?? ''}</div><div style="font-size:10px;color:var(--ds-muted-foreground);font-family:var(--ds-font-mono)">${p.data?.cusip ?? ''}</div></div>` },
    { field: 'side',        headerName: 'Side',      width: 72,  filter: 'agSetColumnFilter',
      cellRenderer: (p: any) => {
        const buy = p.value === 'Buy'
        return `<span style="font-size:10px;padding:2px 8px;border-radius:9999px;font-weight:600;border:1px solid ${buy ? 'rgba(0,163,108,0.3)' : 'rgba(207,32,47,0.3)'};background:${buy ? 'rgba(0,163,108,0.15)' : 'rgba(207,32,47,0.15)'};color:${buy ? 'var(--ds-buy)' : 'var(--ds-sell)'}">${buy ? 'BUY' : 'SELL'}</span>`
      } },
    { field: 'faceValueMM', headerName: 'Size $MM',  width: 80,  type: 'numericColumn', cellClass: 'font-mono font-semibold', filter: 'agNumberColumnFilter' },
    { field: 'limitYield',  headerName: 'Lmt Yield', width: 80,  type: 'numericColumn', cellClass: 'font-mono', filter: 'agNumberColumnFilter', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }), valueFormatter: (p: any) => p.value ? p.value.toFixed(3) + '%' : '—' },
    { field: 'limitPrice',  headerName: 'Lmt Price', width: 78,  type: 'numericColumn', cellClass: 'font-mono', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }), valueFormatter: (p: any) => p.value ? p.value.toFixed(3) : '—' },
    { field: 'filledMM',    headerName: 'Filled',    width: 66,  type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => p.value ?? '—' },
    {
      colId: 'fillPct', headerName: 'Fill %', width: 100, sortable: false, filter: false,
      cellRenderer: (p: any) => {
        const pct = (p.data?.faceValueMM ?? 0) > 0 ? Math.min((p.data.filledMM / p.data.faceValueMM) * 100, 100) : 0
        const color = pct >= 100 ? 'var(--ds-buy)' : pct > 0 ? 'var(--ds-primary)' : 'var(--ds-secondary)'
        return `<div style="display:flex;align-items:center;gap:6px;height:100%"><div style="flex:1;height:4px;background:var(--ds-secondary);border-radius:9999px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${color};border-radius:9999px"></div></div><span style="font-size:10px;font-family:var(--ds-font-mono);color:var(--ds-muted-foreground);width:1.5rem;text-align:right">${pct.toFixed(0)}%</span></div>`
      },
    },
    { field: 'avgFillYield', headerName: 'Avg Yield', width: 82, type: 'numericColumn', cellClass: 'font-mono', valueFormatter: (p: any) => p.value ? p.value.toFixed(3) + '%' : '—' },
    { field: 'venue',        headerName: 'Venue',     width: 100, filter: 'agSetColumnFilter', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }) },
    { field: 'counterparty', headerName: 'Cpty',      width: 110, filter: 'agSetColumnFilter', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }) },
    { field: 'account',      headerName: 'Account',   width: 88,  filter: 'agSetColumnFilter', cellStyle: () => ({ color: 'var(--ds-muted-foreground)' }) },
    {
      field: 'status', headerName: 'Status', width: 90, filter: 'agSetColumnFilter',
      cellRenderer: (p: any) => {
        const s = STATUS_STYLE[p.value] ?? STATUS_STYLE['Cancelled']
        return `<span style="font-size:10px;padding:2px 8px;border-radius:9999px;font-weight:500;background:${s.bg};color:${s.color};border:${s.border}">${p.value}</span>`
      },
    },
  ]

  defaultColDef: ColDef = { sortable: true, resizable: true, minWidth: 50 }

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.counts = STATUS_FILTERS.slice(1).reduce((acc, s) => {
      acc[s] = BASE_ORDERS.filter(o => o.status === s).length
      return acc
    }, {} as Record<string, number>)
    this.updateFilter()
  }

  setFilter(f: StatusFilter): void {
    this.filter = f; this.updateFilter(); this.cdr.markForCheck()
  }

  private updateFilter(): void {
    this.rowData = this.filter === 'All' ? BASE_ORDERS : BASE_ORDERS.filter(o => o.status === this.filter)
  }

  onRowClicked(e: RowClickedEvent<Order>): void {
    this.selected = this.selected?.id === e.data?.id ? null : (e.data ?? null)
    if (this.selected) this.buildDetail(this.selected)
    this.cdr.markForCheck()
  }

  onGridReady(e: GridReadyEvent): void { e.api.sizeColumnsToFit() }

  private buildDetail(o: Order): void {
    this.fillPct = o.faceValueMM > 0 ? Math.min((o.filledMM / o.faceValueMM) * 100, 100) : 0
    this.detailMeta = [['CUSIP', o.cusip], ['Side', o.side], ['Time', o.time], ['Account', o.account]]
    this.detailExec = [
      ['Limit Yield', o.limitYield ? o.limitYield.toFixed(3) + '%' : '—'],
      ['Limit Price', o.limitPrice ? o.limitPrice.toFixed(3) : '—'],
      ['Filled',      o.filledMM + 'MM'],
      ['Avg Yield',   o.avgFillYield ? o.avgFillYield.toFixed(3) + '%' : '—'],
      ['Avg Price',   o.avgFillPrice ? o.avgFillPrice.toFixed(3) : '—'],
    ]
    this.detailSettle = [
      ['Counterparty', o.counterparty], ['Venue', o.venue], ['Trader', o.trader],
      ['Settle', o.cusip.startsWith('CME') ? 'T+1' : 'T+3'],
    ]
  }

  openTicket(): void {
    this.secSearch = ''; this.selectedSec = null; this.ticketSide = 'Buy'
    this.faceValue = '10'; this.limitVal = ''; this.settleDate = 'T+1'; this.submitted = false
    this.dialogRef = this.cdkDialog.open(this.ticketTpl, {
      backdropClass: 'order-ticket-backdrop',
      hasBackdrop: true,
      restoreFocus: true,
    })
    this.dialogRef!.closed.subscribe(() => { this.dialogRef = null; this.cdr.markForCheck() })
  }

  closeTicket(): void { this.dialogRef?.close() }

  selectSec(s: typeof SECURITY_LIST[0]): void {
    this.selectedSec = s
    this.secSearch = s.label
    this.showSecList = false
    this.limitVal = this.priceMode === 'yield' ? s.yield.toFixed(3) : s.price.toFixed(3)
    this.settleDate = s.type === 'Treasury' ? 'T+1' : 'T+3'
    this.cdr.markForCheck()
  }

  getFilteredSec(): typeof SECURITY_LIST {
    if (!this.secSearch) return []
    return SECURITY_LIST.filter(s =>
      s.label.toLowerCase().includes(this.secSearch.toLowerCase()) ||
      s.cusip.toLowerCase().includes(this.secSearch.toLowerCase())
    ).slice(0, 8)
  }

  submitOrder(): void {
    this.submitted = true
    this.cdr.markForCheck()
    setTimeout(() => { this.submitted = false; this.closeTicket(); this.cdr.markForCheck() }, 1800)
  }
}
