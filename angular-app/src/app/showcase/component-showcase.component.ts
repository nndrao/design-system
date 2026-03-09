import { Component, signal, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../theme/theme.service';

// PrimeNG
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { Checkbox } from 'primeng/checkbox';
import { RadioButton } from 'primeng/radiobutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Slider } from 'primeng/slider';
import { Rating } from 'primeng/rating';
import { Knob } from 'primeng/knob';
import { DatePicker } from 'primeng/datepicker';
import { Password } from 'primeng/password';
import { Badge } from 'primeng/badge';
import { Tag } from 'primeng/tag';
import { Chip } from 'primeng/chip';
import { Avatar } from 'primeng/avatar';
import { Card } from 'primeng/card';
import { Panel } from 'primeng/panel';
import { Divider } from 'primeng/divider';
import { Timeline } from 'primeng/timeline';
import { Skeleton } from 'primeng/skeleton';
import { ProgressBar } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Menu } from 'primeng/menu';
import { Menubar } from 'primeng/menubar';
import { Steps } from 'primeng/steps';
import { Dialog } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { Popover } from 'primeng/popover';
import { Toast } from 'primeng/toast';
import { Message } from 'primeng/message';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Carousel } from 'primeng/carousel';
import { SpeedDial } from 'primeng/speeddial';
import { Splitter } from 'primeng/splitter';
import { Tooltip } from 'primeng/tooltip';
import { InputGroup } from 'primeng/inputgroup'
import { InputGroupAddon } from 'primeng/inputgroupaddon';

import { FloatLabel } from 'primeng/floatlabel';
import { MessageService, ConfirmationService, MenuItem, TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';

const SIDEBAR_GROUPS = [
  { label: 'Getting Started', items: ['Introduction', 'Foundations', 'Theming'] },
  { label: 'Form', items: ['Button', 'InputText', 'Textarea', 'InputNumber', 'Select', 'MultiSelect', 'Checkbox', 'RadioButton', 'ToggleSwitch', 'Slider', 'Knob', 'Rating', 'DatePicker', 'Password'] },
  { label: 'Display', items: ['Badge', 'Tag', 'Chip', 'Avatar', 'Card', 'Panel', 'Divider', 'Timeline', 'Skeleton', 'ProgressBar'] },
  { label: 'Data', items: ['DataTable', 'Tree', 'Paginator'] },
  { label: 'Navigation', items: ['Breadcrumb', 'Tabs', 'Accordion', 'Menu', 'Menubar', 'Steps'] },
  { label: 'Overlay', items: ['Dialog', 'Drawer', 'Popover', 'Toast', 'Message', 'ConfirmDialog'] },
  { label: 'Misc', items: ['Carousel', 'SpeedDial', 'Splitter', 'Tooltip'] },
  { label: 'Trading', items: ['Order Entry', 'Order Book', 'Price Ticker'] },
  { label: 'Patterns', items: ['Positions Table', 'Asset List', 'Notifications'] },
];

const DESCRIPTIONS: Record<string, string> = {
  Introduction: 'PrimeNG component library built on the Trading Design System with Coinbase-inspired blue palette.',
  Foundations: 'Design tokens: color palette, typography scale, spacing, border radius, and shadows used across all components.',
  Theming: 'Custom TradingPreset extending PrimeNG Aura with dark/light mode support via .dark-mode class.',
  'Order Entry': 'Buy/Sell order entry form with order type tabs (Limit, Market, Stop Limit) and trading-styled inputs.',
  'Order Book': 'Bid/Ask depth ladder with size-proportional fill bars and buy/sell row tints.',
  'Price Ticker': 'Instrument header bar showing OHLCV stats and real-time price change indicator.',
  'Positions Table': 'Open positions grid with unrealized P&L, side badges, and Edit/Close actions.',
  'Asset List': 'Market list row with icon, name, price, 24h change indicator, and quick Buy action.',
  Notifications: 'Toast notification variants: order fills, price alerts, warnings, and error states.',
  Button: 'Button is an extension to the standard html button element with icons and theming.',
  InputText: 'InputText is an extension to standard input element with theming.',
  Textarea: 'Textarea component with auto-resize and theming support.',
  InputNumber: 'InputNumber is used to enter numeric values with optional formatting.',
  Select: 'Select component to choose from a list of options.',
  MultiSelect: 'MultiSelect is used to select multiple items from a collection.',
  Checkbox: 'Checkbox is an extension to the standard checkbox element with theming.',
  RadioButton: 'RadioButton is an extension to the standard radio button element with theming.',
  ToggleSwitch: 'ToggleSwitch is used to select a boolean value.',
  Slider: 'Slider provides a foundation to handle range and value inputs.',
  Knob: 'Knob is a form component to define number inputs with a dial.',
  Rating: 'Rating component is a star based selection input.',
  DatePicker: 'DatePicker is a form component to work with dates.',
  Password: 'Password component hides the typed text with masking.',
  Badge: 'Badge is a small status descriptor for UI elements.',
  Tag: 'Tag component is used to categorize content.',
  Chip: 'Chip represents entities using small blocks.',
  Avatar: 'Avatar represents people using icons, labels and images.',
  Card: 'Card is a flexible and extensible content container.',
  Panel: 'Panel is a container with the optional content toggle feature.',
  Divider: 'Divider is used to separate contents.',
  Timeline: 'Timeline visualizes a series of chained events.',
  Skeleton: 'Skeleton is a placeholder to display instead of the actual content.',
  ProgressBar: 'ProgressBar is a process status indicator.',
  DataTable: 'DataTable displays data in tabular format with sorting, filtering and pagination.',
  Tree: 'Tree is used to display hierarchical data.',
  Paginator: 'Paginator is a generic component to display content in paged format.',
  Breadcrumb: 'Breadcrumb provides contextual information about page hierarchy.',
  Tabs: 'Tabs facilitates seamless switching between different views.',
  Accordion: 'Accordion groups a collection of contents in collapsible panels.',
  Menu: 'Menu is a navigation/command component that supports dynamic and static positioning.',
  Menubar: 'Menubar is a horizontal navigation component.',
  Steps: 'Steps components is an indicator for the steps in a workflow.',
  Dialog: 'Dialog is a container to display content in an overlay window.',
  Drawer: 'Drawer is a panel component displayed as an overlay at the edges of the screen.',
  Popover: 'Popover is a container component that can overlay other components on page.',
  Toast: 'Toast is used to display messages in an overlay.',
  Message: 'Message is used to display inline messages with various severities.',
  ConfirmDialog: 'ConfirmDialog uses a dialog UI with confirmDialog method or the ConfirmationService.',
  Carousel: 'Carousel is a content slider featuring various customization options.',
  SpeedDial: 'SpeedDial is a floating action button with a list of primary actions.',
  Splitter: 'Splitter is utilized to separate and resize panels.',
  Tooltip: 'Tooltip directive provides advisory information for a component.',
};

const CODE_MAP: Record<string, string> = {
  Button: `import { Button } from 'primeng/button';

<!-- Primary / trading variants -->
<p-button label="Buy BTC" severity="success" [rounded]="true" />
<p-button label="Sell ETH" severity="danger" [rounded]="true" />
<p-button label="Place Order" />
<p-button label="Cancel" severity="secondary" [outlined]="true" />
<p-button icon="pi pi-refresh" [text]="true" [rounded]="true" />
<p-button label="Loading..." [loading]="true" />`,

  InputText: `import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup'
import { InputGroupAddon } from 'primeng/inputgroupaddon';


<p-inputgroup>
  <p-inputgroup-addon>$</p-inputgroup-addon>
  <input pInputText placeholder="Limit Price" [(ngModel)]="price" />
</p-inputgroup>

<p-floatlabel>
  <input id="qty" pInputText [(ngModel)]="quantity" />
  <label for="qty">Quantity (BTC)</label>
</p-floatlabel>`,

  Select: `import { Select } from 'primeng/select';

<p-select
  [options]="pairs"
  [(ngModel)]="selectedPair"
  optionLabel="label"
  optionValue="value"
  placeholder="Select pair"
/>

// In component:
pairs = [
  { label: 'BTC-USD', value: 'btcusd' },
  { label: 'ETH-USD', value: 'ethusd' },
  { label: 'SOL-USD', value: 'solusd' },
];`,

  DataTable: `import { TableModule } from 'primeng/table';

<p-table [value]="positions" [tableStyle]="{'min-width': '40rem'}">
  <ng-template pTemplate="header">
    <tr>
      <th>Pair</th><th>Side</th><th>Size</th><th>PnL</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-pos>
    <tr>
      <td>{{ pos.pair }}</td>
      <td [style.color]="pos.side==='Buy' ? 'var(--ds-buy)' : 'var(--ds-sell)'">
        {{ pos.side }}
      </td>
      <td class="font-mono">{{ pos.size }}</td>
      <td [style.color]="pos.pnl > 0 ? 'var(--ds-buy)' : 'var(--ds-sell)'">
        {{ pos.pnl > 0 ? '+' : '' }}{{ pos.pnl | currency }}
      </td>
    </tr>
  </ng-template>
</p-table>`,

  Dialog: `import { Dialog } from 'primeng/dialog';

<p-button label="Confirm Order" (onClick)="visible = true" />

<p-dialog header="Confirm Order" [(visible)]="visible" [modal]="true" [style]="{width: '28rem'}">
  <div class="order-summary">
    <div class="row"><span>Pair</span><span>BTC-USD</span></div>
    <div class="row"><span>Side</span><span class="buy">Buy</span></div>
    <div class="row"><span>Price</span><span class="mono">$69,820.00</span></div>
    <div class="row"><span>Total</span><span class="mono">$3,491.00</span></div>
  </div>
  <ng-template pTemplate="footer">
    <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="visible = false" />
    <p-button label="Place Order" severity="success" (onClick)="visible = false" />
  </ng-template>
</p-dialog>`,

  Toast: `import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// In providers: [MessageService]
// In template:
<p-toast />

// In component:
constructor(private messageService: MessageService) {}

showSuccess() {
  this.messageService.add({
    severity: 'success',
    summary: 'Order Filled',
    detail: 'Bought 0.05 BTC at $69,820.00'
  });
}`,

  Tabs: `import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';

<p-tabs value="limit">
  <p-tablist>
    <p-tab value="limit">Limit</p-tab>
    <p-tab value="market">Market</p-tab>
    <p-tab value="stop">Stop</p-tab>
  </p-tablist>
  <p-tabpanels>
    <p-tabpanel value="limit">
      <!-- Limit order form -->
    </p-tabpanel>
    <p-tabpanel value="market">
      <!-- Market order form -->
    </p-tabpanel>
  </p-tabpanels>
</p-tabs>`,

  Accordion: `import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';

<p-accordion>
  <p-accordion-panel value="0">
    <p-accordion-header>What are the trading fees?</p-accordion-header>
    <p-accordion-content>
      <p>0.00% maker / 0.05% taker for standard accounts.</p>
    </p-accordion-content>
  </p-accordion-panel>
  <p-accordion-panel value="1">
    <p-accordion-header>How does margin trading work?</p-accordion-header>
    <p-accordion-content>
      <p>Trade with up to 10x leverage on your collateral.</p>
    </p-accordion-content>
  </p-accordion-panel>
</p-accordion>`,
};

@Component({
  selector: 'app-component-showcase',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule, FormsModule,
    Button, InputText, Textarea, InputNumber, Select, MultiSelect,
    Checkbox, RadioButton, ToggleSwitch, Slider, Rating, Knob,
    DatePicker, Password, Badge, Tag, Chip, Avatar, Card, Panel,
    Divider, Timeline, Skeleton, ProgressBar, TableModule, Paginator,
    Breadcrumb, Tabs, TabList, Tab, TabPanels, TabPanel,
    Accordion, AccordionContent, AccordionHeader, AccordionPanel,
    Menu, Menubar, Steps, Dialog, Drawer, Popover, Toast, Message,
    ConfirmDialog, Carousel, SpeedDial, Splitter,
    Tooltip, InputGroup, InputGroupAddon, FloatLabel, Tree,
  ],
  template: `
<p-toast />
<p-confirmdialog />

<div class="sc-root">
  <!-- Sidebar -->
  <aside class="sc-sidebar">
    <div class="sc-sidebar-search">
      <i class="pi pi-search"></i>
      <input type="text" placeholder="Search components..." [(ngModel)]="searchQuery" />
    </div>
    @for (group of filteredGroups(); track group.label) {
      <div class="sc-group">
        <p class="sc-group-label">{{ group.label }}</p>
        @for (item of group.items; track item) {
          <button
            class="sc-item"
            [class.sc-item-active]="selectedComp() === item"
            (click)="select(item)"
          >{{ item }}</button>
        }
      </div>
    }
  </aside>

  <!-- Main -->
  <main class="sc-main">
    <!-- Breadcrumb -->
    <div class="sc-breadcrumb">
      <span class="sc-bc-muted">Components</span>
      <i class="pi pi-chevron-right sc-bc-sep"></i>
      <span>{{ selectedComp() }}</span>
    </div>

    <h1 class="sc-title">{{ selectedComp() }}</h1>
    <p class="sc-desc">{{ descriptions[selectedComp()] }}</p>

    <!-- Install line -->
    @if (selectedComp() !== 'Introduction' && selectedComp() !== 'Theming') {
      <div class="sc-install">
        <i class="pi pi-code"></i>
        <code>import &#123; {{ selectedComp() }} &#125; from 'primeng/{{ selectedComp().toLowerCase() }}'</code>
      </div>
    }

    <!-- Preview / Code tabs -->
    <div class="sc-tabs">
      <button class="sc-tab" [class.sc-tab-active]="docTab() === 'preview'" (click)="docTab.set('preview')">
        <i class="pi pi-eye"></i> Preview
      </button>
      <button class="sc-tab" [class.sc-tab-active]="docTab() === 'code'" (click)="docTab.set('code')">
        <i class="pi pi-code"></i> Code
      </button>
    </div>

    @if (docTab() === 'code') {
      <div class="sc-code-block">
        <button class="sc-copy-btn" (click)="copyCode()">
          <i class="pi pi-copy"></i> Copy
        </button>
        <pre>{{ codeMap[selectedComp()] ?? '// See PrimeNG docs for full API' }}</pre>
      </div>
    } @else {
      <div class="sc-preview">

        <!-- ── Button ───────────────────────────────────────── -->
        @if (selectedComp() === 'Button') {
          <div class="demo-section">
            <p class="demo-label">Variants</p>
            <div class="demo-row wrap">
              <p-button label="Buy BTC" severity="success" [rounded]="true" />
              <p-button label="Sell ETH" severity="danger" [rounded]="true" />
              <p-button label="Place Order" />
              <p-button label="Secondary" severity="secondary" />
              <p-button label="Outlined" [outlined]="true" />
              <p-button label="Text" [text]="true" />
              <p-button label="Warning" severity="warn" />
              <p-button label="Info" severity="info" />
            </div>
            <p class="demo-label" style="margin-top:1.25rem">Sizes & Icons</p>
            <div class="demo-row wrap">
              <p-button label="Small" size="small" />
              <p-button label="Normal" />
              <p-button label="Large" size="large" />
              <p-button icon="pi pi-arrow-up" severity="success" [rounded]="true" [outlined]="true" />
              <p-button icon="pi pi-arrow-down" severity="danger" [rounded]="true" [outlined]="true" />
              <p-button label="Refresh" icon="pi pi-refresh" iconPos="left" severity="secondary" />
              <p-button label="Loading..." [loading]="true" />
            </div>
          </div>
        }

        <!-- ── InputText ───────────────────────────────────── -->
        @if (selectedComp() === 'InputText') {
          <div class="demo-section">
            <p class="demo-label">With Addons</p>
            <div class="demo-col">
              <p-inputgroup>
                <p-inputgroup-addon>$</p-inputgroup-addon>
                <input pInputText placeholder="Limit Price (USD)" [(ngModel)]="demoPrice" />
              </p-inputgroup>
              <p-inputgroup>
                <input pInputText placeholder="Amount" [(ngModel)]="demoQty" />
                <p-inputgroup-addon>BTC</p-inputgroup-addon>
              </p-inputgroup>
              <p-inputgroup>
                <p-inputgroup-addon><i class="pi pi-search"></i></p-inputgroup-addon>
                <input pInputText placeholder="Search markets..." />
              </p-inputgroup>
            </div>
            <p class="demo-label" style="margin-top:1rem">Float Label</p>
            <div class="demo-col">
              <p-floatlabel>
                <input id="apikey" pInputText [(ngModel)]="demoApiKey" />
                <label for="apikey">API Key</label>
              </p-floatlabel>
              <input pInputText [disabled]="true" value="Read-only field" />
            </div>
          </div>
        }

        <!-- ── Textarea ─────────────────────────────────────── -->
        @if (selectedComp() === 'Textarea') {
          <div class="demo-section">
            <div class="demo-col" style="max-width:380px">
              <p class="demo-label">Order Notes</p>
              <textarea pTextarea rows="3" placeholder="Add notes to this order..." [(ngModel)]="demoNote" style="width:100%"></textarea>
              <p class="demo-label">Webhook URL</p>
              <textarea pTextarea rows="2" [(ngModel)]="demoWebhook" style="width:100%"></textarea>
              <p class="demo-label">Read-only</p>
              <textarea pTextarea rows="2" [disabled]="true" value="This field is read-only" style="width:100%"></textarea>
            </div>
          </div>
        }

        <!-- ── InputNumber ──────────────────────────────────── -->
        @if (selectedComp() === 'InputNumber') {
          <div class="demo-section">
            <div class="demo-col" style="max-width:320px">
              <p class="demo-label">Currency</p>
              <p-inputnumber [(ngModel)]="demoPortfolioVal" mode="currency" currency="USD" locale="en-US" />
              <p class="demo-label">Quantity with Buttons</p>
              <p-inputnumber [(ngModel)]="demoOrderQty" [showButtons]="true" [min]="0" [step]="0.001" [maxFractionDigits]="4" suffix=" BTC" />
              <p class="demo-label">Leverage (1–20x)</p>
              <p-inputnumber [(ngModel)]="demoLeverage" [showButtons]="true" [min]="1" [max]="20" suffix="x" />
            </div>
          </div>
        }

        <!-- ── Select ───────────────────────────────────────── -->
        @if (selectedComp() === 'Select') {
          <div class="demo-section">
            <div class="demo-col" style="max-width:300px">
              <p class="demo-label">Trading Pair</p>
              <p-select [options]="tradingPairs" [(ngModel)]="selectedPair" optionLabel="label" optionValue="value" placeholder="Select pair" [style]="{'width':'100%'}" />
              <p class="demo-label">Time in Force</p>
              <p-select [options]="tifOptions" [(ngModel)]="selectedTif" optionLabel="label" optionValue="value" [style]="{'width':'100%'}" />
              <p class="demo-label">Account Type</p>
              <p-select [options]="accountTypes" [(ngModel)]="selectedAccount" optionLabel="label" optionValue="value" [style]="{'width':'100%'}" />
            </div>
          </div>
        }

        <!-- ── MultiSelect ──────────────────────────────────── -->
        @if (selectedComp() === 'MultiSelect') {
          <div class="demo-section">
            <div class="demo-col" style="max-width:340px">
              <p class="demo-label">Filter Assets</p>
              <p-multiselect [options]="assetOptions" [(ngModel)]="selectedAssets" optionLabel="label" placeholder="Select assets" display="chip" [style]="{'width':'100%'}" />
              <p class="demo-label" style="margin-top:0.5rem">Selected: {{ selectedAssets.join(', ') || 'none' }}</p>
            </div>
          </div>
        }

        <!-- ── Checkbox ─────────────────────────────────────── -->
        @if (selectedComp() === 'Checkbox') {
          <div class="demo-section">
            <p class="demo-label">Order Confirmations</p>
            <div class="demo-col" style="gap:0.75rem">
              <div class="demo-row"><p-checkbox [(ngModel)]="chkReduceOnly" [binary]="true" inputId="ro" /><label for="ro">Reduce Only</label></div>
              <div class="demo-row"><p-checkbox [(ngModel)]="chkPostOnly" [binary]="true" inputId="po" /><label for="po">Post Only (Maker)</label></div>
              <div class="demo-row"><p-checkbox [(ngModel)]="chkConfirm" [binary]="true" inputId="cf" /><label for="cf">I confirm the order details</label></div>
              <div class="demo-row"><p-checkbox [ngModel]="true" [binary]="true" [disabled]="true" inputId="dis" /><label for="dis">Two-factor enabled (locked)</label></div>
            </div>
          </div>
        }

        <!-- ── RadioButton ─────────────────────────────────── -->
        @if (selectedComp() === 'RadioButton') {
          <div class="demo-section">
            <div class="demo-row" style="gap:2.5rem; align-items:flex-start">
              <div>
                <p class="demo-label">Order Type</p>
                <div class="demo-col" style="gap:0.75rem">
                  @for (ot of orderTypes; track ot) {
                    <div class="demo-row">
                      <p-radiobutton [inputId]="ot" name="orderType" [value]="ot" [(ngModel)]="selectedOrderType" />
                      <label [for]="ot">{{ ot }}</label>
                    </div>
                  }
                </div>
              </div>
              <div>
                <p class="demo-label">Time in Force</p>
                <div class="demo-col" style="gap:0.75rem">
                  @for (t of tifLabels; track t) {
                    <div class="demo-row">
                      <p-radiobutton [inputId]="'tif_'+t" name="tif" [value]="t" [(ngModel)]="selectedTifLabel" />
                      <label [for]="'tif_'+t">{{ t }}</label>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- ── ToggleSwitch ─────────────────────────────────── -->
        @if (selectedComp() === 'ToggleSwitch') {
          <div class="demo-section">
            <p class="demo-label">Preferences</p>
            <div class="demo-col" style="max-width:320px;gap:1rem">
              @for (pref of preferences; track pref.label) {
                <div class="demo-row" style="justify-content:space-between">
                  <div>
                    <div style="font-size:0.8125rem;font-weight:500">{{ pref.label }}</div>
                    <div style="font-size:0.6875rem;color:var(--ds-muted-foreground)">{{ pref.desc }}</div>
                  </div>
                  <p-toggleswitch [(ngModel)]="pref.value" />
                </div>
              }
            </div>
          </div>
        }

        <!-- ── Slider ───────────────────────────────────────── -->
        @if (selectedComp() === 'Slider') {
          <div class="demo-section" style="max-width:360px">
            <p class="demo-label">Leverage — <strong style="color:var(--p-primary-color)">{{ demoLeverage }}x</strong></p>
            <p-slider [(ngModel)]="demoLeverage" [min]="1" [max]="20" [step]="1" styleClass="w-full" />
            <div class="demo-row" style="justify-content:space-between;margin-top:0.25rem;font-size:0.6875rem;color:var(--ds-muted-foreground)">
              <span>1x</span><span>5x</span><span>10x</span><span>20x</span>
            </div>
            <p class="demo-label" style="margin-top:1.5rem">Portfolio Allocation — <strong>{{ demoAllocation }}%</strong></p>
            <p-slider [(ngModel)]="demoAllocation" [min]="0" [max]="100" [step]="5" styleClass="w-full" />
            <p class="demo-label" style="margin-top:1.5rem">Risk Tolerance (Range)</p>
            <p-slider [(ngModel)]="demoRange" [range]="true" [min]="0" [max]="100" styleClass="w-full" />
            <p style="font-size:0.6875rem;color:var(--ds-muted-foreground);margin-top:0.25rem">{{ demoRange[0] }}% – {{ demoRange[1] }}%</p>
          </div>
        }

        <!-- ── Knob ─────────────────────────────────────────── -->
        @if (selectedComp() === 'Knob') {
          <div class="demo-section">
            <div class="demo-row" style="gap:2.5rem;align-items:flex-start;flex-wrap:wrap">
              <div class="demo-col" style="align-items:center">
                <p class="demo-label">Leverage</p>
                <p-knob [(ngModel)]="demoLeverage" [min]="1" [max]="20" valueTemplate="{value}x" />
              </div>
              <div class="demo-col" style="align-items:center">
                <p class="demo-label">Risk Score</p>
                <p-knob [(ngModel)]="demoRisk" [min]="0" [max]="100" valueTemplate="{value}" valueColor="var(--ds-sell)" rangeColor="var(--ds-border)" />
              </div>
              <div class="demo-col" style="align-items:center">
                <p class="demo-label">Allocation %</p>
                <p-knob [(ngModel)]="demoAllocation" [min]="0" [max]="100" valueTemplate="{value}%" valueColor="var(--ds-buy)" rangeColor="var(--ds-border)" />
              </div>
            </div>
          </div>
        }

        <!-- ── Rating ───────────────────────────────────────── -->
        @if (selectedComp() === 'Rating') {
          <div class="demo-section">
            <div class="demo-col" style="gap:1.25rem">
              @for (asset of ratedAssets; track asset.name) {
                <div class="demo-row" style="justify-content:space-between;max-width:300px">
                  <div>
                    <div style="font-size:0.8125rem;font-weight:600">{{ asset.name }}</div>
                    <div style="font-size:0.6875rem;color:var(--ds-muted-foreground)">{{ asset.desc }}</div>
                  </div>
                  <p-rating [(ngModel)]="asset.rating" />
                </div>
              }
            </div>
          </div>
        }

        <!-- ── DatePicker ───────────────────────────────────── -->
        @if (selectedComp() === 'DatePicker') {
          <div class="demo-section">
            <div class="demo-col" style="max-width:320px;gap:1.25rem">
              <div>
                <p class="demo-label">Settlement Date</p>
                <p-datepicker [(ngModel)]="selectedDate" placeholder="Select date" [showIcon]="true" [style]="{'width':'100%'}" />
              </div>
              <div>
                <p class="demo-label">Report Period</p>
                <p-datepicker [(ngModel)]="selectedDateRange" selectionMode="range" placeholder="Select range" [showIcon]="true" [style]="{'width':'100%'}" />
              </div>
              <div>
                <p class="demo-label">Inline Calendar</p>
                <p-datepicker [(ngModel)]="selectedDate" [inline]="true" />
              </div>
            </div>
          </div>
        }

        <!-- ── Password ─────────────────────────────────────── -->
        @if (selectedComp() === 'Password') {
          <div class="demo-section">
            <div class="demo-col" style="max-width:300px">
              <p class="demo-label">API Secret Key</p>
              <p-password [(ngModel)]="demoPassword" placeholder="Enter API secret" [feedback]="false" [toggleMask]="true" [style]="{'width':'100%'}" />
              <p class="demo-label">New Password</p>
              <p-password [(ngModel)]="demoPassword2" placeholder="Create password" [toggleMask]="true" [style]="{'width':'100%'}" />
            </div>
          </div>
        }

        <!-- ── Badge ────────────────────────────────────────── -->
        @if (selectedComp() === 'Badge') {
          <div class="demo-section">
            <p class="demo-label">Severities</p>
            <div class="demo-row wrap">
              <p-badge value="4" />
              <p-badge value="12" severity="success" />
              <p-badge value="3" severity="danger" />
              <p-badge value="!" severity="warn" />
              <p-badge value="i" severity="info" />
              <p-badge value="99+" severity="secondary" />
            </div>
            <p class="demo-label" style="margin-top:1.25rem">Positioned on Icons</p>
            <div class="demo-row" style="gap:2rem">
              <div class="demo-badge-wrap">
                <i class="pi pi-bell" style="font-size:1.5rem"></i>
                <p-badge value="3" severity="danger" styleClass="demo-badge-pos" />
              </div>
              <div class="demo-badge-wrap">
                <i class="pi pi-shopping-cart" style="font-size:1.5rem"></i>
                <p-badge value="7" styleClass="demo-badge-pos" />
              </div>
              <div class="demo-badge-wrap">
                <i class="pi pi-inbox" style="font-size:1.5rem"></i>
                <p-badge value="99+" severity="success" styleClass="demo-badge-pos" />
              </div>
            </div>
          </div>
        }

        <!-- ── Tag ──────────────────────────────────────────── -->
        @if (selectedComp() === 'Tag') {
          <div class="demo-section">
            <p class="demo-label">Order Status</p>
            <div class="demo-row wrap">
              <p-tag value="Open" severity="info" />
              <p-tag value="Filled" severity="success" />
              <p-tag value="Partial Fill" severity="warn" />
              <p-tag value="Cancelled" severity="secondary" />
              <p-tag value="Rejected" severity="danger" />
            </div>
            <p class="demo-label" style="margin-top:1rem">With Icons</p>
            <div class="demo-row wrap">
              <p-tag value="Buy" icon="pi pi-arrow-up" severity="success" />
              <p-tag value="Sell" icon="pi pi-arrow-down" severity="danger" />
              <p-tag value="Live" icon="pi pi-circle-fill" severity="success" />
              <p-tag value="Suspended" icon="pi pi-ban" severity="danger" />
            </div>
          </div>
        }

        <!-- ── Chip ─────────────────────────────────────────── -->
        @if (selectedComp() === 'Chip') {
          <div class="demo-section">
            <p class="demo-label">Active Filters</p>
            <div class="demo-row wrap">
              @for (c of chips; track c) {
                <p-chip [label]="c" [removable]="true" (onRemove)="removeChip(c)" />
              }
            </div>
            <p class="demo-label" style="margin-top:1rem">With Icons</p>
            <div class="demo-row wrap">
              <p-chip label="BTC" icon="pi pi-bitcoin" />
              <p-chip label="Spot Only" icon="pi pi-tag" />
              <p-chip label="Filled" icon="pi pi-check-circle" />
            </div>
          </div>
        }

        <!-- ── Avatar ───────────────────────────────────────── -->
        @if (selectedComp() === 'Avatar') {
          <div class="demo-section">
            <p class="demo-label">Sizes & Types</p>
            <div class="demo-row" style="gap:1.25rem; align-items:center">
              <p-avatar label="A" size="large" shape="circle" />
              <p-avatar label="JD" shape="circle" [style]="{'background':'var(--p-primary-color)','color':'#fff'}" />
              <p-avatar icon="pi pi-user" size="large" shape="circle" />
              <p-avatar icon="pi pi-user" shape="circle" />
            </div>
            <p class="demo-label" style="margin-top:1rem">Trader Profiles</p>
            <div class="demo-col" style="gap:0.75rem">
              @for (trader of traders; track trader.name) {
                <div class="demo-row" style="gap:0.75rem">
                  <p-avatar [label]="trader.initials" shape="circle" [style]="{'background':trader.color,'color':'#fff','font-size':'0.6875rem'}" />
                  <div>
                    <div style="font-size:0.8125rem;font-weight:500">{{ trader.name }}</div>
                    <div style="font-size:0.6875rem;color:var(--ds-muted-foreground)">{{ trader.role }}</div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ── Card ─────────────────────────────────────────── -->
        @if (selectedComp() === 'Card') {
          <div class="demo-row wrap" style="gap:1rem; align-items:flex-start">
            @for (asset of assetCards; track asset.symbol) {
              <p-card [style]="{'width':'200px'}">
                <ng-template pTemplate="header">
                  <div class="card-asset-header">
                    <span class="card-symbol">{{ asset.symbol }}</span>
                    <p-tag [value]="asset.change > 0 ? '+'+asset.change+'%' : asset.change+'%'" [severity]="asset.change > 0 ? 'success' : 'danger'" />
                  </div>
                </ng-template>
                <p class="card-price">{{ asset.price }}</p>
                <p class="card-name">{{ asset.name }}</p>
                <ng-template pTemplate="footer">
                  <div class="demo-row" style="gap:0.5rem">
                    <p-button label="Buy" severity="success" size="small" [rounded]="true" styleClass="flex-1" />
                    <p-button label="Sell" severity="danger" size="small" [rounded]="true" styleClass="flex-1" />
                  </div>
                </ng-template>
              </p-card>
            }
          </div>
        }

        <!-- ── Panel ────────────────────────────────────────── -->
        @if (selectedComp() === 'Panel') {
          <div class="demo-col" style="max-width:420px">
            <p-panel header="Portfolio Summary" [toggleable]="true">
              <div class="demo-col" style="gap:0.5rem; font-size:0.8125rem">
                @for (row of portfolioRows; track row.label) {
                  <div class="demo-row" style="justify-content:space-between">
                    <span style="color:var(--ds-muted-foreground)">{{ row.label }}</span>
                    <span class="mono" [style.color]="row.color || 'inherit'">{{ row.value }}</span>
                  </div>
                }
              </div>
            </p-panel>
            <p-panel header="Risk Settings" [toggleable]="true" [collapsed]="true">
              <p style="font-size:0.8125rem;color:var(--ds-muted-foreground)">Configure stop-loss, take-profit and margin call thresholds.</p>
            </p-panel>
          </div>
        }

        <!-- ── Divider ──────────────────────────────────────── -->
        @if (selectedComp() === 'Divider') {
          <div class="demo-col" style="max-width:360px">
            <p style="font-size:0.8125rem">Order Summary</p>
            <p-divider />
            <div class="demo-col" style="gap:0.4rem;font-size:0.8125rem">
              @for (r of orderSummary; track r.label) {
                <div class="demo-row" style="justify-content:space-between">
                  <span style="color:var(--ds-muted-foreground)">{{ r.label }}</span>
                  <span class="mono">{{ r.value }}</span>
                </div>
              }
            </div>
            <p-divider align="center"><span style="font-size:0.6875rem;color:var(--ds-muted-foreground)">Fees</span></p-divider>
            <div class="demo-row" style="justify-content:space-between;font-size:0.8125rem">
              <span style="color:var(--ds-muted-foreground)">Trading Fee (0.05%)</span>
              <span class="mono" style="color:var(--ds-buy)">$0.00</span>
            </div>
            <p-divider layout="vertical" style="display:none" />
          </div>
        }

        <!-- ── Timeline ─────────────────────────────────────── -->
        @if (selectedComp() === 'Timeline') {
          <div style="max-width:380px">
            <p-timeline [value]="timelineEvents" align="left">
              <ng-template pTemplate="marker" let-event>
                <span class="timeline-marker" [style.background]="event.color"><i [class]="event.icon" style="font-size:0.6875rem;color:#fff"></i></span>
              </ng-template>
              <ng-template pTemplate="content" let-event>
                <div class="timeline-content">
                  <span class="timeline-title">{{ event.status }}</span>
                  <span class="timeline-time">{{ event.date }}</span>
                  <span class="timeline-desc">{{ event.detail }}</span>
                </div>
              </ng-template>
            </p-timeline>
          </div>
        }

        <!-- ── Skeleton ─────────────────────────────────────── -->
        @if (selectedComp() === 'Skeleton') {
          <div class="demo-col" style="max-width:380px; gap:1.5rem">
            <div>
              <p class="demo-label">Order Book Loading</p>
              <div class="demo-col" style="gap:0.35rem">
                @for (i of [1,2,3,4,5]; track i) {
                  <div class="demo-row" style="gap:0.5rem">
                    <p-skeleton width="5rem" height="1rem" />
                    <p-skeleton width="4rem" height="1rem" />
                    <p-skeleton width="4rem" height="1rem" />
                  </div>
                }
              </div>
            </div>
            <div>
              <p class="demo-label">Asset Cards Loading</p>
              <div class="demo-row" style="gap:0.75rem">
                @for (i of [1,2,3]; track i) {
                  <div class="demo-col" style="gap:0.4rem;padding:0.75rem;border:1px solid var(--ds-border);border-radius:8px;width:100px">
                    <p-skeleton width="3rem" height="0.75rem" />
                    <p-skeleton width="5rem" height="1.25rem" />
                    <p-skeleton width="3.5rem" height="0.75rem" />
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- ── ProgressBar ──────────────────────────────────── -->
        @if (selectedComp() === 'ProgressBar') {
          <div class="demo-col" style="max-width:380px; gap:1.25rem">
            @for (p of progressItems; track p.label) {
              <div>
                <div class="demo-row" style="justify-content:space-between; margin-bottom:0.3rem">
                  <span style="font-size:0.8125rem">{{ p.label }}</span>
                  <span style="font-size:0.8125rem; font-family:var(--ds-font-mono)">{{ p.value }}%</span>
                </div>
                <p-progressbar [value]="p.value" [style]="{'height':'6px'}" [showValue]="false" />
              </div>
            }
            <div>
              <p class="demo-label">Order Fill Progress (animated)</p>
              <p-progressbar mode="indeterminate" [style]="{'height':'4px'}" />
            </div>
          </div>
        }

        <!-- ── DataTable ─────────────────────────────────────── -->
        @if (selectedComp() === 'DataTable') {
          <div style="width:100%">
            <p-table [value]="positions" [tableStyle]="{'min-width':'36rem'}" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th>Pair</th>
                  <th>Side</th>
                  <th>Size</th>
                  <th>Entry Price</th>
                  <th>Mark Price</th>
                  <th>PnL</th>
                  <th>Status</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-pos>
                <tr>
                  <td style="font-weight:600">{{ pos.pair }}</td>
                  <td [style.color]="pos.side==='Buy'?'var(--ds-buy)':'var(--ds-sell)'">{{ pos.side }}</td>
                  <td class="mono">{{ pos.size }}</td>
                  <td class="mono">{{ pos.entry | currency }}</td>
                  <td class="mono">{{ pos.mark | currency }}</td>
                  <td class="mono" [style.color]="pos.pnl>=0?'var(--ds-buy)':'var(--ds-sell)'">
                    {{ pos.pnl >= 0 ? '+' : '' }}{{ pos.pnl | currency }}
                  </td>
                  <td><p-tag [value]="pos.status" [severity]="pos.status==='Open'?'success':'secondary'" /></td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr><td colspan="7" style="text-align:center;color:var(--ds-muted-foreground);padding:2rem">No positions found</td></tr>
              </ng-template>
            </p-table>
          </div>
        }

        <!-- ── Tree ─────────────────────────────────────────── -->
        @if (selectedComp() === 'Tree') {
          <div style="max-width:320px">
            <p class="demo-label">Asset Hierarchy</p>
            <p-tree [value]="treeNodes" styleClass="w-full" />
          </div>
        }

        <!-- ── Paginator ─────────────────────────────────────── -->
        @if (selectedComp() === 'Paginator') {
          <div class="demo-col">
            <p style="font-size:0.8125rem;color:var(--ds-muted-foreground)">
              Showing orders {{ (paginatorPage * 10) + 1 }}–{{ (paginatorPage + 1) * 10 }} of 347
            </p>
            <p-paginator
              [first]="paginatorPage * 10"
              [rows]="10"
              [totalRecords]="347"
              [rowsPerPageOptions]="[10, 25, 50]"
              (onPageChange)="onPageChange($event)"
            />
          </div>
        }

        <!-- ── Breadcrumb ────────────────────────────────────── -->
        @if (selectedComp() === 'Breadcrumb') {
          <div class="demo-col" style="gap:1.25rem">
            <p-breadcrumb [home]="breadcrumbHome" [model]="breadcrumbItems" />
            <p-breadcrumb [home]="breadcrumbHome" [model]="breadcrumbItems2" />
          </div>
        }

        <!-- ── Tabs ─────────────────────────────────────────── -->
        @if (selectedComp() === 'Tabs') {
          <div style="width:100%;max-width:480px">
            <p-tabs value="limit">
              <p-tablist>
                <p-tab value="limit">Limit</p-tab>
                <p-tab value="market">Market</p-tab>
                <p-tab value="stop">Stop Limit</p-tab>
              </p-tablist>
              <p-tabpanels>
                <p-tabpanel value="limit">
                  <div class="demo-col" style="padding:1rem;gap:0.75rem">
                    <div><p class="demo-label">Price (USD)</p><p-inputnumber [(ngModel)]="demoLimitPrice" mode="currency" currency="USD" [style]="{'width':'100%'}" /></div>
                    <div><p class="demo-label">Amount (BTC)</p><p-inputnumber [(ngModel)]="demoOrderQty" [maxFractionDigits]="4" suffix=" BTC" [style]="{'width':'100%'}" /></div>
                    <p-button label="Place Limit Buy" severity="success" [rounded]="true" styleClass="w-full" />
                  </div>
                </p-tabpanel>
                <p-tabpanel value="market">
                  <div class="demo-col" style="padding:1rem;gap:0.75rem">
                    <div><p class="demo-label">Amount (USD)</p><p-inputnumber [(ngModel)]="demoMarketAmt" mode="currency" currency="USD" [style]="{'width':'100%'}" /></div>
                    <p-button label="Buy at Market" severity="success" [rounded]="true" styleClass="w-full" />
                  </div>
                </p-tabpanel>
                <p-tabpanel value="stop">
                  <div class="demo-col" style="padding:1rem;gap:0.75rem">
                    <div><p class="demo-label">Stop Price</p><p-inputnumber [(ngModel)]="demoStopPrice" mode="currency" currency="USD" [style]="{'width':'100%'}" /></div>
                    <div><p class="demo-label">Limit Price</p><p-inputnumber [(ngModel)]="demoLimitPrice" mode="currency" currency="USD" [style]="{'width':'100%'}" /></div>
                    <p-button label="Place Stop Limit" severity="warn" [rounded]="true" styleClass="w-full" />
                  </div>
                </p-tabpanel>
              </p-tabpanels>
            </p-tabs>
          </div>
        }

        <!-- ── Accordion ─────────────────────────────────────── -->
        @if (selectedComp() === 'Accordion') {
          <div style="max-width:440px;width:100%">
            <p-accordion>
              @for (faq of faqs; track faq.q) {
                <p-accordion-panel [value]="faq.q">
                  <p-accordion-header>{{ faq.q }}</p-accordion-header>
                  <p-accordion-content>
                    <p style="font-size:0.8125rem;color:var(--ds-muted-foreground);margin:0">{{ faq.a }}</p>
                  </p-accordion-content>
                </p-accordion-panel>
              }
            </p-accordion>
          </div>
        }

        <!-- ── Menu ─────────────────────────────────────────── -->
        @if (selectedComp() === 'Menu') {
          <div class="demo-col" style="gap:1.5rem">
            <div>
              <p class="demo-label">Context Menu (click button to open)</p>
              <p-button label="Order Actions" icon="pi pi-chevron-down" iconPos="right" [outlined]="true" (onClick)="contextMenu.toggle($event)" />
              <p-menu #contextMenu [model]="menuItems" [popup]="true" />
            </div>
            <div>
              <p class="demo-label">Inline Menu</p>
              <p-menu [model]="menuItems" />
            </div>
          </div>
        }

        <!-- ── Menubar ───────────────────────────────────────── -->
        @if (selectedComp() === 'Menubar') {
          <div style="width:100%">
            <p-menubar [model]="menubarItems">
              <ng-template pTemplate="end">
                <p-inputgroup>
                  <p-inputgroup-addon><i class="pi pi-search"></i></p-inputgroup-addon>
                  <input pInputText placeholder="Search markets..." style="height:2rem;font-size:0.75rem" />
                </p-inputgroup>
              </ng-template>
            </p-menubar>
          </div>
        }

        <!-- ── Steps ────────────────────────────────────────── -->
        @if (selectedComp() === 'Steps') {
          <div style="width:100%">
            <p-steps [model]="stepsItems" [activeIndex]="activeStep" [readonly]="false" (activeIndexChange)="activeStep = $event" />
            <div class="steps-content">
              @switch (activeStep) {
                @case (0) {
                  <div class="demo-col" style="gap:0.75rem;max-width:320px">
                    <p class="demo-label">Select Trading Pair</p>
                    <p-select [options]="tradingPairs" [(ngModel)]="selectedPair" optionLabel="label" optionValue="value" [style]="{'width':'100%'}" />
                    <p-button label="Next: Order Details →" (onClick)="activeStep = 1" />
                  </div>
                }
                @case (1) {
                  <div class="demo-col" style="gap:0.75rem;max-width:320px">
                    <p class="demo-label">Set Order Details</p>
                    <p-inputnumber [(ngModel)]="demoLimitPrice" mode="currency" currency="USD" placeholder="Limit Price" [style]="{'width':'100%'}" />
                    <p-inputnumber [(ngModel)]="demoOrderQty" suffix=" BTC" placeholder="Quantity" [style]="{'width':'100%'}" />
                    <div class="demo-row">
                      <p-button label="← Back" severity="secondary" [outlined]="true" (onClick)="activeStep = 0" />
                      <p-button label="Next: Review →" (onClick)="activeStep = 2" />
                    </div>
                  </div>
                }
                @case (2) {
                  <div class="demo-col" style="gap:0.75rem;max-width:320px">
                    <p class="demo-label">Confirm & Place</p>
                    <div class="demo-col" style="gap:0.4rem;font-size:0.8125rem">
                      @for (r of orderSummary; track r.label) {
                        <div class="demo-row" style="justify-content:space-between">
                          <span style="color:var(--ds-muted-foreground)">{{ r.label }}</span>
                          <span class="mono">{{ r.value }}</span>
                        </div>
                      }
                    </div>
                    <div class="demo-row">
                      <p-button label="← Back" severity="secondary" [outlined]="true" (onClick)="activeStep = 1" />
                      <p-button label="Place Order ✓" severity="success" [rounded]="true" (onClick)="activeStep = 3" />
                    </div>
                  </div>
                }
                @case (3) {
                  <div class="demo-col" style="align-items:center;gap:0.75rem;padding:1.5rem">
                    <i class="pi pi-check-circle" style="font-size:3rem;color:var(--ds-buy)"></i>
                    <p style="font-weight:600">Order Placed Successfully!</p>
                    <p-button label="New Order" severity="secondary" [outlined]="true" (onClick)="activeStep = 0" />
                  </div>
                }
              }
            </div>
          </div>
        }

        <!-- ── Dialog ────────────────────────────────────────── -->
        @if (selectedComp() === 'Dialog') {
          <div class="demo-row wrap" style="gap:0.75rem">
            <p-button label="Confirm Order" icon="pi pi-check" (onClick)="dialogVisible.set(true)" />
            <p-button label="Risk Warning" icon="pi pi-exclamation-triangle" severity="warn" (onClick)="warnDialogVisible.set(true)" />
            <p-dialog header="Confirm Order" [(visible)]="dialogVisible" [modal]="true" [style]="{'width':'26rem'}" [draggable]="false">
              <div class="demo-col" style="gap:0.4rem;font-size:0.8125rem">
                @for (r of orderSummary; track r.label) {
                  <div class="demo-row" style="justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid var(--ds-border)">
                    <span style="color:var(--ds-muted-foreground)">{{ r.label }}</span>
                    <span class="mono">{{ r.value }}</span>
                  </div>
                }
              </div>
              <ng-template pTemplate="footer">
                <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="dialogVisible.set(false)" />
                <p-button label="Place Order" severity="success" [rounded]="true" (onClick)="dialogVisible.set(false); showTradeToast()" />
              </ng-template>
            </p-dialog>
            <p-dialog header="Margin Warning" [(visible)]="warnDialogVisible" [modal]="true" [style]="{'width':'22rem'}" [draggable]="false">
              <p style="font-size:0.8125rem;color:var(--ds-muted-foreground)">This order will use 85% of your available margin. High leverage increases liquidation risk.</p>
              <ng-template pTemplate="footer">
                <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="warnDialogVisible.set(false)" />
                <p-button label="Proceed Anyway" severity="warn" (onClick)="warnDialogVisible.set(false)" />
              </ng-template>
            </p-dialog>
          </div>
        }

        <!-- ── Drawer ────────────────────────────────────────── -->
        @if (selectedComp() === 'Drawer') {
          <div class="demo-row" style="gap:0.75rem">
            <p-button label="Order Details →" icon="pi pi-arrow-right" iconPos="right" [outlined]="true" (onClick)="drawerVisible.set(true)" />
            <p-drawer header="Order #4821 — BTC-USD" [(visible)]="drawerVisible" position="right" [style]="{'width':'22rem'}">
              <div class="demo-col" style="gap:0.75rem;font-size:0.8125rem">
                @for (r of drawerDetails; track r.label) {
                  <div class="demo-row" style="justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--ds-border)">
                    <span style="color:var(--ds-muted-foreground)">{{ r.label }}</span>
                    <span class="mono" [style.color]="r.color || 'inherit'">{{ r.value }}</span>
                  </div>
                }
              </div>
              <ng-template pTemplate="footer">
                <p-button label="Cancel Order" severity="danger" [outlined]="true" styleClass="w-full" (onClick)="drawerVisible.set(false)" />
              </ng-template>
            </p-drawer>
          </div>
        }

        <!-- ── Popover ────────────────────────────────────────── -->
        @if (selectedComp() === 'Popover') {
          <div class="demo-row" style="gap:0.75rem; flex-wrap:wrap">
            <p-button label="Quick Stats" icon="pi pi-chart-bar" [outlined]="true" (onClick)="statsPopover.toggle($event)" />
            <p-button label="Set Alert" icon="pi pi-bell" severity="warn" [outlined]="true" (onClick)="alertPopover.toggle($event)" />
          </div>
          <p-popover #statsPopover>
            <div class="demo-col" style="padding:0.5rem;gap:0.4rem;min-width:180px;font-size:0.8125rem">
              <p style="font-weight:600;margin:0">BTC-USD Stats</p>
              @for (s of btcStats; track s.label) {
                <div class="demo-row" style="justify-content:space-between;gap:1.5rem">
                  <span style="color:var(--ds-muted-foreground)">{{ s.label }}</span>
                  <span class="mono" [style.color]="s.color || 'inherit'">{{ s.value }}</span>
                </div>
              }
            </div>
          </p-popover>
          <p-popover #alertPopover>
            <div style="padding:0.5rem;min-width:220px">
              <p style="font-weight:600;font-size:0.8125rem;margin:0 0 0.75rem">Set Price Alert</p>
              <p-inputgroup style="margin-bottom:0.5rem">
                <p-inputgroup-addon>$</p-inputgroup-addon>
                <input pInputText placeholder="Alert price" [(ngModel)]="alertPrice" style="width:100%" />
              </p-inputgroup>
              <p-button label="Create Alert" icon="pi pi-bell" size="small" styleClass="w-full" (onClick)="alertPopover.hide(); showAlertToast()" />
            </div>
          </p-popover>
        }

        <!-- ── Toast ─────────────────────────────────────────── -->
        @if (selectedComp() === 'Toast') {
          <div class="demo-row wrap" style="gap:0.75rem">
            <p-button label="Order Filled" severity="success" icon="pi pi-check" (onClick)="showToast('success','Order Filled','Bought 0.05 BTC at $69,820.00')" />
            <p-button label="Order Rejected" severity="danger" icon="pi pi-times" (onClick)="showToast('error','Order Rejected','Insufficient margin for this position')" />
            <p-button label="Price Alert" severity="warn" icon="pi pi-bell" (onClick)="showToast('warn','Price Alert','BTC-USD crossed $70,000')" />
            <p-button label="Info" severity="info" icon="pi pi-info-circle" (onClick)="showToast('info','Market Update','BTC-USD 24h volume: $28.4B')" />
          </div>
        }

        <!-- ── Message ───────────────────────────────────────── -->
        @if (selectedComp() === 'Message') {
          <div class="demo-col" style="max-width:440px;gap:0.75rem">
            <p-message severity="success" text="Order Filled: Bought 0.05 BTC at $69,820.00" />
            <p-message severity="info" text="Your account is approaching the 24h withdrawal limit." />
            <p-message severity="warn" text="High leverage detected. Current position uses 85% margin." />
            <p-message severity="error" text="Order Rejected: Price outside allowed range for this market." />
          </div>
        }

        <!-- ── ConfirmDialog ──────────────────────────────────── -->
        @if (selectedComp() === 'ConfirmDialog') {
          <div class="demo-row" style="gap:0.75rem">
            <p-button label="Cancel Order" severity="danger" [outlined]="true" icon="pi pi-times" (onClick)="confirmCancel()" />
            <p-button label="Close Position" severity="warn" icon="pi pi-sign-out" (onClick)="confirmClose()" />
          </div>
        }

        <!-- ── Carousel ──────────────────────────────────────── -->
        @if (selectedComp() === 'Carousel') {
          <div style="width:100%">
            <p class="demo-label">Top Movers</p>
            <p-carousel [value]="carouselItems" [numVisible]="3" [numScroll]="1" [circular]="true" [autoplayInterval]="3000">
              <ng-template pTemplate="item" let-item>
                <div class="carousel-card">
                  <div class="carousel-symbol">{{ item.symbol }}</div>
                  <div class="carousel-price">{{ item.price }}</div>
                  <div class="carousel-change" [style.color]="item.change > 0 ? 'var(--ds-buy)' : 'var(--ds-sell)'">
                    {{ item.change > 0 ? '+' : '' }}{{ item.change }}%
                  </div>
                </div>
              </ng-template>
            </p-carousel>
          </div>
        }

        <!-- ── SpeedDial ─────────────────────────────────────── -->
        @if (selectedComp() === 'SpeedDial') {
          <div style="position:relative;height:220px;width:100%;display:flex;align-items:center;justify-content:center;background:var(--ds-secondary);border-radius:8px;border:1px solid var(--ds-border)">
            <p style="font-size:0.75rem;color:var(--ds-muted-foreground)">Click the button to expand actions</p>
            <p-speeddial [model]="speedDialItems" direction="up" [style]="{'position':'absolute','bottom':'1rem','right':'1.5rem'}" buttonClassName="p-button-success p-button-rounded" />
          </div>
        }

        <!-- ── Splitter ──────────────────────────────────────── -->
        @if (selectedComp() === 'Splitter') {
          <div style="width:100%;height:260px;border:1px solid var(--ds-border);border-radius:8px;overflow:hidden">
            <p-splitter [style]="{'height':'100%'}" [panelSizes]="[60,40]">
              <ng-template pTemplate="panel">
                <div class="splitter-panel">
                  <p class="demo-label">Chart Panel</p>
                  <div class="splitter-placeholder"><i class="pi pi-chart-line" style="font-size:2rem;color:var(--ds-muted-foreground)"></i></div>
                </div>
              </ng-template>
              <ng-template pTemplate="panel">
                <p-splitter layout="vertical" [panelSizes]="[55,45]" [style]="{'height':'100%'}">
                  <ng-template pTemplate="panel">
                    <div class="splitter-panel">
                      <p class="demo-label">Order Book</p>
                      <div class="splitter-placeholder"><i class="pi pi-list" style="font-size:1.5rem;color:var(--ds-muted-foreground)"></i></div>
                    </div>
                  </ng-template>
                  <ng-template pTemplate="panel">
                    <div class="splitter-panel">
                      <p class="demo-label">Trade Form</p>
                      <div class="splitter-placeholder"><i class="pi pi-send" style="font-size:1.5rem;color:var(--ds-muted-foreground)"></i></div>
                    </div>
                  </ng-template>
                </p-splitter>
              </ng-template>
            </p-splitter>
          </div>
        }

        <!-- ── Tooltip ───────────────────────────────────────── -->
        @if (selectedComp() === 'Tooltip') {
          <div class="demo-section">
            <p class="demo-label">Hover each button to see tooltip</p>
            <div class="demo-row wrap">
              <p-button label="Buy BTC" severity="success" [rounded]="true" pTooltip="Place a buy order for BTC-USD" tooltipPosition="top" />
              <p-button label="Sell BTC" severity="danger" [rounded]="true" pTooltip="Place a sell order for BTC-USD" tooltipPosition="top" />
              <p-button icon="pi pi-refresh" [text]="true" [rounded]="true" pTooltip="Refresh order book" tooltipPosition="right" />
              <p-button icon="pi pi-cog" [text]="true" [rounded]="true" pTooltip="Open settings" tooltipPosition="bottom" />
              <p-button icon="pi pi-bell" [text]="true" [rounded]="true" pTooltip="3 active price alerts" tooltipPosition="left" />
            </div>
          </div>
        }

        <!-- ── Introduction ──────────────────────────────────── -->
        @if (selectedComp() === 'Introduction') {
          <div class="intro-section">
            <p>The <strong>Trading Design System</strong> PrimeNG library provides a comprehensive set of components built on the Coinbase-inspired palette — blue primary, green/red buy/sell actions, and dark/light mode support.</p>
            <div class="intro-grid">
              @for (f of introFeatures; track f.title) {
                <div class="intro-card">
                  <i [class]="f.icon" style="font-size:1.5rem;color:var(--p-primary-color)"></i>
                  <h3>{{ f.title }}</h3>
                  <p>{{ f.desc }}</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- ── Foundations ────────────────────────────────────── -->
        @if (selectedComp() === 'Foundations') {
          <div class="fd-section">
            <!-- Color Palette -->
            <div class="fd-block">
              <h3 class="fd-heading">Color Palette</h3>
              <div class="fd-palette-row">
                @for (g of foundationColors; track g.label) {
                  <div class="fd-palette-col">
                    <div class="fd-palette-swatch" [style.background]="g.color"></div>
                    <div class="fd-palette-label">{{ g.label }}</div>
                    <div class="fd-palette-val mono">{{ g.color }}</div>
                  </div>
                }
              </div>
            </div>
            <!-- Typography -->
            <div class="fd-block">
              <h3 class="fd-heading">Typography</h3>
              <div class="fd-type-rows">
                <div class="fd-type-row"><span class="fd-type-label">Sans (UI)</span><span style="font-family:Inter;font-size:0.875rem">Inter — The quick brown fox jumps over the lazy dog</span></div>
                <div class="fd-type-row"><span class="fd-type-label">Mono (Prices)</span><span style="font-family:var(--ds-font-mono);font-size:0.875rem">JetBrains Mono — $72,814.50 +2.36%</span></div>
                <div class="fd-type-row"><span class="fd-type-label">Base size</span><span style="font-size:0.875rem">13px compact trading UI</span></div>
                <div class="fd-type-row"><span class="fd-type-label">Scale</span>
                  <span class="fd-type-scale">
                    @for (s of typeSizes; track s.size) {
                      <span [style.font-size]="s.px">{{ s.size }}</span>
                    }
                  </span>
                </div>
              </div>
            </div>
            <!-- Radius -->
            <div class="fd-block">
              <h3 class="fd-heading">Border Radius</h3>
              <div class="fd-radius-row">
                @for (r of radiusScale; track r.name) {
                  <div class="fd-radius-item">
                    <div class="fd-radius-box" [style.border-radius]="r.value"></div>
                    <div class="fd-palette-label">{{ r.name }}</div>
                    <div class="fd-palette-val">{{ r.value }}</div>
                  </div>
                }
              </div>
            </div>
            <!-- Shadows -->
            <div class="fd-block">
              <h3 class="fd-heading">Shadows</h3>
              <div class="fd-shadow-row">
                @for (s of shadowScale; track s.name) {
                  <div class="fd-shadow-item" [style.box-shadow]="s.value">{{ s.name }}</div>
                }
              </div>
            </div>
          </div>
        }

        <!-- ── Theming ────────────────────────────────────────── -->
        @if (selectedComp() === 'Theming') {
          <div class="intro-section">
            <p>The <strong>TradingPreset</strong> extends PrimeNG Aura with Coinbase blue primary and custom dark surface scale.</p>
            <div class="swatch-grid">
              @for (swatch of colorSwatches; track swatch.name) {
                <div class="swatch-item">
                  <div class="swatch-color" [style.background]="swatch.value"></div>
                  <div class="swatch-name">{{ swatch.name }}</div>
                  <div class="swatch-value mono">{{ swatch.value }}</div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ── Order Entry ─────────────────────────────────────── -->
        @if (selectedComp() === 'Order Entry') {
          <div class="oe-wrap">
            <div class="oe-card">
              <div class="oe-side-tabs">
                <button class="oe-side-tab" [class.buy-active]="oeSide === 'Buy'" (click)="oeSide = 'Buy'">Buy</button>
                <button class="oe-side-tab" [class.sell-active]="oeSide === 'Sell'" (click)="oeSide = 'Sell'">Sell</button>
              </div>
              <div class="oe-body">
                <div class="oe-type-tabs">
                  @for (t of ['Limit','Market','Stop Limit']; track t) {
                    <button class="oe-type-tab" [class.active]="oeType === t" (click)="oeType = t">{{ t }}</button>
                  }
                </div>
                <div class="oe-fields">
                  <div class="oe-field">
                    <label class="oe-label">Price (USD)</label>
                    <p-inputNumber [(ngModel)]="oePrice" [useGrouping]="true" prefix="$" [disabled]="oeType === 'Market'" styleClass="oe-input" inputStyleClass="oe-input-el" />
                  </div>
                  <div class="oe-field">
                    <label class="oe-label">Amount (BTC)</label>
                    <p-inputNumber [(ngModel)]="oeAmt" [minFractionDigits]="4" [maxFractionDigits]="8" styleClass="oe-input" inputStyleClass="oe-input-el" />
                  </div>
                  @if (oeType === 'Stop Limit') {
                    <div class="oe-field">
                      <label class="oe-label">Stop Price (USD)</label>
                      <p-inputNumber [(ngModel)]="oeStop" [useGrouping]="true" prefix="$" styleClass="oe-input" inputStyleClass="oe-input-el" />
                    </div>
                  }
                  <div class="oe-total">
                    <span class="oe-total-label">Order Value</span>
                    <span class="oe-total-val mono">{{ oeType === 'Market' ? 'Market' : '$' + (oePrice * oeAmt).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) }}</span>
                  </div>
                  <p-button [label]="oeSide + ' BTC'" [styleClass]="oeSide === 'Buy' ? 'oe-buy-btn' : 'oe-sell-btn'" class="oe-submit" />
                </div>
              </div>
            </div>
          </div>
        }

        <!-- ── Order Book ──────────────────────────────────────── -->
        @if (selectedComp() === 'Order Book') {
          <div class="ob-wrap">
            <div class="ob-card">
              <div class="ob-header">
                <span class="ob-title">BTC-USD</span>
                <span class="ob-spread mono">Spread: <strong>0.50</strong></span>
              </div>
              <div class="ob-cols">
                <span class="ob-col-label muted-text">Price (USD)</span>
                <span class="ob-col-label muted-text" style="text-align:right">Size (BTC)</span>
                <span class="ob-col-label muted-text" style="text-align:right">Total</span>
              </div>
              <div class="ob-asks">
                @for (row of obAsks; track row.price) {
                  <div class="ob-row ob-ask-row">
                    <div class="ob-fill ob-ask-fill" [style.width.%]="row.pct"></div>
                    <span class="mono sell-text">{{ row.price.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) }}</span>
                    <span class="mono" style="text-align:right">{{ row.size }}</span>
                    <span class="mono muted-text" style="text-align:right">{{ row.total }}</span>
                  </div>
                }
              </div>
              <div class="ob-mid">
                <span class="ob-mid-price mono">$72,814.50</span>
                <span class="buy-text" style="font-size:11px;font-family:var(--ds-font-mono)">▲ +$28.30</span>
              </div>
              <div class="ob-bids">
                @for (row of obBids; track row.price) {
                  <div class="ob-row ob-bid-row">
                    <div class="ob-fill ob-bid-fill" [style.width.%]="row.pct"></div>
                    <span class="mono buy-text">{{ row.price.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) }}</span>
                    <span class="mono" style="text-align:right">{{ row.size }}</span>
                    <span class="mono muted-text" style="text-align:right">{{ row.total }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- ── Price Ticker ────────────────────────────────────── -->
        @if (selectedComp() === 'Price Ticker') {
          <div class="pt-wrap">
            <div class="pt-bar">
              <div class="pt-instrument">
                <span class="pt-symbol">BTC / USD</span>
                <span class="pt-exchange muted-text">Coinbase Advanced</span>
              </div>
              <div class="pt-price-block">
                <span class="pt-price mono">$72,814.50</span>
                <span class="buy-text pt-chg mono">▲ +$1,643.10 (+2.31%)</span>
              </div>
              @for (stat of ptStats; track stat.label) {
                <div class="pt-stat">
                  <span class="muted-text pt-stat-label">{{ stat.label }}</span>
                  <span class="mono pt-stat-val" [style.color]="stat.color ?? 'inherit'">{{ stat.value }}</span>
                </div>
              }
            </div>
            <!-- Candlestick colors -->
            <div class="cs-section">
              <h4 class="fd-heading" style="margin-bottom:0.75rem">Candlestick Colors</h4>
              <div class="cs-row">
                <div class="cs-candle">
                  <div class="cs-wick cs-bull-wick"></div>
                  <div class="cs-body cs-bull"></div>
                  <div class="cs-wick cs-bull-wick"></div>
                  <span class="cs-label buy-text">Bullish</span>
                </div>
                <div class="cs-candle">
                  <div class="cs-wick cs-bear-wick"></div>
                  <div class="cs-body cs-bear"></div>
                  <div class="cs-wick cs-bear-wick"></div>
                  <span class="cs-label sell-text">Bearish</span>
                </div>
                <div class="cs-info">
                  <div class="cs-info-row"><span class="cs-dot" style="background:var(--ds-buy)"></span><span>Bullish candle — <code>--ds-buy</code></span></div>
                  <div class="cs-info-row"><span class="cs-dot" style="background:var(--ds-sell)"></span><span>Bearish candle — <code>--ds-sell</code></span></div>
                  <div class="cs-info-row"><span class="cs-dot" style="background:rgba(0,212,126,0.08)"></span><span>Buy row tint — <code>rgba(--ds-buy, 0.08)</code></span></div>
                  <div class="cs-info-row"><span class="cs-dot" style="background:rgba(255,99,125,0.08)"></span><span>Sell row tint — <code>rgba(--ds-sell, 0.08)</code></span></div>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- ── Positions Table ─────────────────────────────────── -->
        @if (selectedComp() === 'Positions Table') {
          <div class="pos-wrap">
            <table class="pos-table">
              <thead>
                <tr>
                  <th>Asset</th><th>Side</th><th>Size</th><th>Entry</th><th>Mark</th><th>Unr. P&amp;L</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (p of positionRows; track p.asset) {
                  <tr [class.buy-row]="p.side === 'Long'" [class.sell-row]="p.side === 'Short'">
                    <td class="pos-asset"><strong>{{ p.asset }}</strong></td>
                    <td><p-tag [value]="p.side" [severity]="p.side === 'Long' ? 'success' : 'danger'" [rounded]="true" styleClass="pos-badge" /></td>
                    <td class="mono">{{ p.size }}</td>
                    <td class="mono muted-text">{{ p.entry }}</td>
                    <td class="mono">{{ p.mark }}</td>
                    <td class="mono" [class.buy-text]="p.pnl >= 0" [class.sell-text]="p.pnl < 0">{{ p.pnl >= 0 ? ('+$' + p.pnl.toLocaleString('en-US', {maximumFractionDigits:0})) : ('-$' + (-p.pnl).toLocaleString('en-US', {maximumFractionDigits:0})) }}</td>
                    <td>
                      <div class="pos-actions">
                        <p-button label="Edit" size="small" [text]="true" />
                        <p-button label="Close" size="small" [text]="true" severity="danger" (onClick)="confirmClose()" />
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- ── Asset List ──────────────────────────────────────── -->
        @if (selectedComp() === 'Asset List') {
          <div class="al-wrap">
            @for (a of assetListRows; track a.symbol) {
              <div class="al-row">
                <div class="al-icon">{{ a.icon }}</div>
                <div class="al-info">
                  <div class="al-symbol">{{ a.symbol }}</div>
                  <div class="al-name muted-text">{{ a.name }}</div>
                </div>
                <div class="al-price-block">
                  <div class="al-price mono">{{ a.price }}</div>
                  <div class="al-chg mono" [class.buy-text]="a.change >= 0" [class.sell-text]="a.change < 0">
                    {{ a.change >= 0 ? '+' : '' }}{{ a.change.toFixed(2) }}%
                  </div>
                </div>
                <p-button label="Buy" size="small" severity="success" [rounded]="true" />
              </div>
            }
          </div>
        }

        <!-- ── Notifications ──────────────────────────────────── -->
        @if (selectedComp() === 'Notifications') {
          <div class="notif-wrap">
            <div class="notif-label">Toast variants (click to trigger)</div>
            <div class="demo-row" style="margin-bottom:1.5rem">
              <p-button label="Order Filled" severity="success" [rounded]="true" size="small" (onClick)="showToast('success','Order Filled','Bought 0.05 BTC at $69,820.00')" />
              <p-button label="Price Alert" severity="warn" [rounded]="true" size="small" (onClick)="showToast('warn','Price Alert','BTC crossed $73,000')" />
              <p-button label="Order Failed" severity="danger" [rounded]="true" size="small" (onClick)="showToast('error','Order Failed','Insufficient funds for this order')" />
              <p-button label="Market Info" [rounded]="true" size="small" (onClick)="showToast('info','Market Update','BTC 24h volume: $28.4B')" />
            </div>
            <div class="notif-label">Inline message variants</div>
            <div class="demo-col" style="gap:0.5rem">
              <p-message severity="success" text="Order filled: Bought 0.05 BTC at $69,820.00" styleClass="w-full" />
              <p-message severity="warn" text="Margin utilization at 82% — consider reducing position size" styleClass="w-full" />
              <p-message severity="error" text="Order rejected: Insufficient buying power" styleClass="w-full" />
              <p-message severity="info" text="Settlement in T+1 for US Treasuries" styleClass="w-full" />
            </div>
          </div>
        }

      </div><!-- /sc-preview -->
    }<!-- /@else preview -->
  </main>
</div>
  `,
  styles: [`
    .sc-root {
      display: flex;
      height: calc(100vh - 2.5rem);
      overflow: hidden;
      background: var(--ds-background);
    }
    /* Sidebar */
    .sc-sidebar {
      width: 13.5rem;
      flex-shrink: 0;
      border-right: 1px solid var(--ds-border);
      background: var(--ds-card);
      overflow-y: auto;
      padding: 0.75rem 0;
    }
    .sc-sidebar-search {
      display: flex; align-items: center; gap: 0.5rem;
      margin: 0 0.75rem 0.75rem;
      padding: 0.35rem 0.6rem;
      border-radius: 6px;
      background: var(--ds-secondary);
      color: var(--ds-muted-foreground);
      font-size: 0.75rem;
    }
    .sc-sidebar-search input {
      border: none; background: none; outline: none; flex: 1;
      color: var(--ds-foreground); font-size: 0.75rem;
    }
    .sc-group { margin-bottom: 1rem; padding: 0 0.5rem; }
    .sc-group-label {
      font-size: 0.6875rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ds-muted-foreground);
      padding: 0 0.5rem; margin: 0 0 0.25rem;
    }
    .sc-item {
      display: block; width: 100%;
      padding: 0.35rem 0.5rem;
      border-radius: 5px; border: none; background: none;
      color: var(--ds-muted-foreground);
      font-size: 0.8rem; text-align: left; cursor: pointer;
      transition: color 0.1s, background 0.1s;
    }
    .sc-item:hover { color: var(--ds-foreground); background: var(--ds-secondary); }
    .sc-item-active { background: var(--ds-secondary); color: var(--ds-foreground); font-weight: 600; }

    /* Main */
    .sc-main {
      flex: 1; overflow-y: auto;
      padding: 2rem 2.5rem;
    }
    .sc-breadcrumb {
      display: flex; align-items: center; gap: 0.4rem;
      font-size: 0.75rem; color: var(--ds-muted-foreground); margin-bottom: 1rem;
    }
    .sc-bc-muted { color: var(--ds-muted-foreground); }
    .sc-bc-sep { font-size: 0.6rem; }
    .sc-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.375rem; }
    .sc-desc { font-size: 0.875rem; color: var(--ds-muted-foreground); margin: 0 0 1rem; max-width: 600px; }
    .sc-install {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.375rem 0.75rem; border-radius: 6px;
      background: var(--ds-secondary); border: 1px solid var(--ds-border);
      font-size: 0.75rem; margin-bottom: 1.25rem; color: var(--ds-muted-foreground);
    }
    .sc-install code { font-family: var(--ds-font-mono); color: var(--ds-foreground); }

    /* Tabs */
    .sc-tabs { display: flex; gap: 0.25rem; margin-bottom: 0; border-bottom: 1px solid var(--ds-border); }
    .sc-tab {
      padding: 0.5rem 0.875rem; font-size: 0.8rem; font-weight: 500;
      background: none; border: none; border-bottom: 2px solid transparent;
      color: var(--ds-muted-foreground); cursor: pointer; display: flex; align-items: center; gap: 0.35rem;
      margin-bottom: -1px; transition: color 0.15s;
    }
    .sc-tab:hover { color: var(--ds-foreground); }
    .sc-tab-active { color: var(--ds-foreground); border-bottom-color: var(--p-primary-color); }

    /* Code block */
    .sc-code-block {
      position: relative;
      background: var(--ds-secondary);
      border: 1px solid var(--ds-border);
      border-radius: 0 0 8px 8px;
      padding: 1.25rem 1.5rem;
      overflow: auto;
      min-height: 120px;
      max-height: 520px;
    }
    .sc-code-block pre {
      margin: 0; font-family: var(--ds-font-mono);
      font-size: 0.78rem; line-height: 1.6;
      color: var(--ds-foreground); white-space: pre;
    }
    .sc-copy-btn {
      position: absolute; top: 0.75rem; right: 0.75rem;
      padding: 0.25rem 0.6rem; font-size: 0.7rem;
      background: var(--ds-accent); border: 1px solid var(--ds-border);
      border-radius: 4px; color: var(--ds-muted-foreground); cursor: pointer;
      display: flex; align-items: center; gap: 0.25rem;
    }
    .sc-copy-btn:hover { color: var(--ds-foreground); }

    /* Preview */
    .sc-preview {
      border: 1px solid var(--ds-border);
      border-top: none;
      border-radius: 0 0 8px 8px;
      padding: 2rem;
      background: var(--ds-background);
      min-height: 180px;
    }
    .demo-section { display: flex; flex-direction: column; gap: 0.5rem; }
    .demo-label { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ds-muted-foreground); margin: 0 0 0.4rem; }
    .demo-row { display: flex; align-items: center; gap: 0.75rem; }
    .demo-row.wrap { flex-wrap: wrap; }
    .demo-col { display: flex; flex-direction: column; gap: 0.6rem; }
    .mono { font-family: var(--ds-font-mono); }

    /* Badge positioned */
    .demo-badge-wrap { position: relative; display: inline-flex; }
    .demo-badge-pos { position: absolute !important; top: -6px; right: -6px; }

    /* Card demo */
    .card-asset-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0.75rem 0; }
    .card-symbol { font-weight: 700; font-size: 0.875rem; }
    .card-price { font-size: 1.125rem; font-weight: 700; font-family: var(--ds-font-mono); margin: 0 0 0.2rem; }
    .card-name { font-size: 0.6875rem; color: var(--ds-muted-foreground); margin: 0; }

    /* Timeline */
    .timeline-marker { display: flex; align-items: center; justify-content: center; width: 1.5rem; height: 1.5rem; border-radius: 50%; }
    .timeline-content { display: flex; flex-direction: column; gap: 0.1rem; padding-bottom: 0.75rem; }
    .timeline-title { font-size: 0.8125rem; font-weight: 600; }
    .timeline-time { font-size: 0.6875rem; color: var(--ds-muted-foreground); font-family: var(--ds-font-mono); }
    .timeline-desc { font-size: 0.75rem; color: var(--ds-muted-foreground); }

    /* Steps content */
    .steps-content { margin-top: 1.5rem; padding: 1.25rem; background: var(--ds-secondary); border-radius: 8px; border: 1px solid var(--ds-border); }

    /* Carousel */
    .carousel-card {
      margin: 0.5rem; padding: 1.25rem; border-radius: 8px;
      border: 1px solid var(--ds-border); background: var(--ds-card);
      text-align: center;
    }
    .carousel-symbol { font-size: 0.75rem; color: var(--ds-muted-foreground); font-weight: 600; text-transform: uppercase; }
    .carousel-price { font-size: 1.125rem; font-weight: 700; font-family: var(--ds-font-mono); margin: 0.25rem 0; }
    .carousel-change { font-size: 0.8125rem; font-weight: 600; }

    /* Splitter panels */
    .splitter-panel { height: 100%; display: flex; flex-direction: column; padding: 0.75rem; }
    .splitter-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; }

    /* Intro */
    .intro-section { max-width: 600px; }
    .intro-section > p { font-size: 0.875rem; color: var(--ds-muted-foreground); margin-bottom: 1.5rem; }
    .intro-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .intro-card { padding: 1rem; border-radius: 8px; border: 1px solid var(--ds-border); background: var(--ds-card); display: flex; flex-direction: column; gap: 0.4rem; }
    .intro-card h3 { margin: 0; font-size: 0.8125rem; font-weight: 600; }
    .intro-card p { margin: 0; font-size: 0.75rem; color: var(--ds-muted-foreground); }

    /* Theming swatches */
    .swatch-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .swatch-item { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
    .swatch-color { width: 3.5rem; height: 3.5rem; border-radius: 8px; border: 1px solid var(--ds-border); }
    .swatch-name { font-size: 0.6875rem; font-weight: 600; }
    .swatch-value { font-size: 0.625rem; color: var(--ds-muted-foreground); }

    /* Foundations */
    .fd-section { display: flex; flex-direction: column; gap: 2rem; }
    .fd-block { display: flex; flex-direction: column; gap: 0.75rem; }
    .fd-heading { margin: 0; font-size: 0.8125rem; font-weight: 600; color: var(--ds-foreground); }
    .fd-palette-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .fd-palette-col { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
    .fd-palette-swatch { width: 4rem; height: 4rem; border-radius: 8px; border: 1px solid var(--ds-border); }
    .fd-palette-label { font-size: 0.6875rem; font-weight: 600; }
    .fd-palette-val { font-size: 0.625rem; color: var(--ds-muted-foreground); font-family: var(--ds-font-mono); }
    .fd-type-rows { display: flex; flex-direction: column; gap: 0.75rem; }
    .fd-type-row { display: flex; align-items: baseline; gap: 1rem; font-size: 0.8125rem; }
    .fd-type-label { width: 9rem; flex-shrink: 0; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ds-muted-foreground); }
    .fd-type-scale { display: flex; align-items: baseline; gap: 1rem; color: var(--ds-muted-foreground); }
    .fd-radius-row { display: flex; flex-wrap: wrap; gap: 1rem; }
    .fd-radius-item { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
    .fd-radius-box { width: 3rem; height: 3rem; background: var(--ds-primary); opacity: 0.7; }
    .fd-shadow-row { display: flex; flex-wrap: wrap; gap: 1rem; }
    .fd-shadow-item { padding: 1rem 1.5rem; background: var(--ds-card); border-radius: 8px; font-size: 0.75rem; color: var(--ds-muted-foreground); border: 1px solid var(--ds-border); }

    /* Shared color helpers */
    .buy-text { color: var(--ds-buy); }
    .sell-text { color: var(--ds-sell); }
    .muted-text { color: var(--ds-muted-foreground); }
    .buy-row { background: rgba(0,212,126,0.03); }
    .sell-row { background: rgba(255,99,125,0.03); }

    /* Order Entry */
    .oe-wrap { display: flex; justify-content: center; }
    .oe-card { width: 20rem; border: 1px solid var(--ds-border); border-radius: 12px; background: var(--ds-card); overflow: hidden; }
    .oe-side-tabs { display: flex; }
    .oe-side-tab { flex: 1; padding: 0.625rem; font-size: 0.8125rem; font-weight: 600; background: none; border: none; border-bottom: 2px solid var(--ds-border); color: var(--ds-muted-foreground); cursor: pointer; transition: all 0.15s; }
    .oe-side-tab.buy-active { color: var(--ds-buy); border-bottom-color: var(--ds-buy); background: rgba(0,212,126,0.06); }
    .oe-side-tab.sell-active { color: var(--ds-sell); border-bottom-color: var(--ds-sell); background: rgba(255,99,125,0.06); }
    .oe-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .oe-type-tabs { display: flex; border-bottom: 1px solid var(--ds-border); margin: -0.25rem 0 0.25rem; }
    .oe-type-tab { padding: 0.375rem 0.75rem; font-size: 0.75rem; font-weight: 500; background: none; border: none; border-bottom: 2px solid transparent; color: var(--ds-muted-foreground); cursor: pointer; transition: all 0.15s; margin-bottom: -1px; }
    .oe-type-tab.active { color: var(--ds-foreground); border-bottom-color: var(--ds-primary); }
    .oe-fields { display: flex; flex-direction: column; gap: 0.75rem; }
    .oe-field { display: flex; flex-direction: column; gap: 0.25rem; }
    .oe-label { font-size: 0.6875rem; font-weight: 600; color: var(--ds-muted-foreground); text-transform: uppercase; letter-spacing: 0.05em; }
    .oe-input { width: 100%; }
    .oe-input-el { width: 100%; }
    .oe-total { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-top: 1px solid var(--ds-border); }
    .oe-total-label { font-size: 0.75rem; color: var(--ds-muted-foreground); }
    .oe-total-val { font-size: 0.875rem; font-weight: 600; font-family: var(--ds-font-mono); }
    .oe-submit { width: 100%; }
    .oe-buy-btn { width: 100%; background: var(--ds-buy) !important; border-color: var(--ds-buy) !important; color: #fff !important; border-radius: 9999px !important; }
    .oe-sell-btn { width: 100%; background: var(--ds-sell) !important; border-color: var(--ds-sell) !important; color: #fff !important; border-radius: 9999px !important; }

    /* Order Book */
    .ob-wrap { display: flex; justify-content: center; }
    .ob-card { width: 22rem; border: 1px solid var(--ds-border); border-radius: 12px; background: var(--ds-card); overflow: hidden; font-size: 11px; }
    .ob-header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--ds-border); }
    .ob-title { font-size: 0.8125rem; font-weight: 600; }
    .ob-spread { font-size: 10px; color: var(--ds-muted-foreground); }
    .ob-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 0.25rem 0.75rem; border-bottom: 1px solid var(--ds-border); font-size: 10px; }
    .ob-col-label { color: var(--ds-muted-foreground); font-size: 10px; }
    .ob-asks { display: flex; flex-direction: column-reverse; }
    .ob-bids { display: flex; flex-direction: column; }
    .ob-row { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 0.2rem 0.75rem; position: relative; align-items: center; }
    .ob-fill { position: absolute; top: 0; right: 0; height: 100%; opacity: 0.12; pointer-events: none; }
    .ob-ask-fill { background: var(--ds-sell); }
    .ob-bid-fill { background: var(--ds-buy); }
    .ob-mid { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.75rem; border-top: 1px solid var(--ds-border); border-bottom: 1px solid var(--ds-border); background: var(--ds-secondary); }
    .ob-mid-price { font-size: 0.9375rem; font-weight: 700; }

    /* Price Ticker */
    .pt-wrap { display: flex; flex-direction: column; gap: 1.5rem; }
    .pt-bar { display: flex; align-items: center; gap: 1.5rem; padding: 0.75rem 1rem; border: 1px solid var(--ds-border); border-radius: 12px; background: var(--ds-card); flex-wrap: wrap; }
    .pt-instrument { display: flex; flex-direction: column; gap: 2px; margin-right: 0.5rem; }
    .pt-symbol { font-size: 1rem; font-weight: 700; }
    .pt-exchange { font-size: 10px; }
    .pt-price-block { display: flex; flex-direction: column; gap: 2px; margin-right: 1rem; }
    .pt-price { font-size: 1.375rem; font-weight: 700; }
    .pt-chg { font-size: 0.75rem; }
    .pt-stat { display: flex; flex-direction: column; gap: 1px; }
    .pt-stat-label { font-size: 10px; }
    .pt-stat-val { font-size: 0.75rem; font-weight: 600; }
    .cs-section { padding: 1rem; border: 1px solid var(--ds-border); border-radius: 12px; background: var(--ds-card); }
    .cs-row { display: flex; align-items: flex-start; gap: 3rem; }
    .cs-candle { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .cs-wick { width: 2px; height: 24px; }
    .cs-body { width: 16px; height: 40px; border-radius: 2px; }
    .cs-bull { background: var(--ds-buy); }
    .cs-bear { background: var(--ds-sell); }
    .cs-bull-wick { background: var(--ds-buy); }
    .cs-bear-wick { background: var(--ds-sell); }
    .cs-label { font-size: 11px; font-weight: 600; margin-top: 4px; }
    .cs-info { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; }
    .cs-info-row { display: flex; align-items: center; gap: 0.5rem; }
    .cs-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; border: 1px solid var(--ds-border); }

    /* Positions Table */
    .pos-wrap { overflow-x: auto; }
    .pos-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
    .pos-table th { padding: 0.5rem 0.75rem; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ds-muted-foreground); border-bottom: 1px solid var(--ds-border); text-align: left; background: var(--ds-secondary); }
    .pos-table td { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--ds-border); }
    .pos-asset { font-weight: 600; }
    .pos-badge { font-size: 0.6875rem !important; padding: 0.1rem 0.5rem !important; }
    .pos-actions { display: flex; gap: 0.25rem; }

    /* Asset List */
    .al-wrap { display: flex; flex-direction: column; border: 1px solid var(--ds-border); border-radius: 12px; background: var(--ds-card); overflow: hidden; max-width: 480px; }
    .al-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-bottom: 1px solid var(--ds-border); transition: background 0.1s; }
    .al-row:last-child { border-bottom: none; }
    .al-row:hover { background: var(--ds-secondary); }
    .al-icon { width: 2rem; height: 2rem; border-radius: 50%; background: var(--ds-secondary); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; border: 1px solid var(--ds-border); }
    .al-info { flex: 1; min-width: 0; }
    .al-symbol { font-size: 0.8125rem; font-weight: 600; }
    .al-name { font-size: 0.6875rem; }
    .al-price-block { text-align: right; margin-right: 1rem; }
    .al-price { font-size: 0.8125rem; font-weight: 600; }
    .al-chg { font-size: 0.6875rem; }

    /* Notifications */
    .notif-wrap { display: flex; flex-direction: column; gap: 1.5rem; }
    .notif-label { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ds-muted-foreground); }
  `],
})
export class ComponentShowcaseComponent implements OnInit {
  @ViewChild('statsPopover') statsPopover!: Popover;
  @ViewChild('alertPopover') alertPopover!: Popover;
  @ViewChild('contextMenu') contextMenu!: Menu;

  selectedComp = signal('Introduction');
  docTab = signal<'preview' | 'code'>('preview');
  searchQuery = '';

  // Dialog states
  dialogVisible = signal(false);
  warnDialogVisible = signal(false);
  drawerVisible = signal(false);

  // Form values
  demoPrice = '69820.00';
  demoQty = '0.0500';
  demoApiKey = '';
  demoNote = '';
  demoWebhook = 'https://my-alerts.io/webhook/btc-price';
  demoPassword = '';
  demoPassword2 = '';
  demoPortfolioVal = 24830;
  demoOrderQty = 0.05;
  demoLeverage = 5;
  demoRisk = 42;
  demoAllocation = 60;
  demoRange = [20, 75];
  demoLimitPrice = 69820;
  demoMarketAmt = 500;
  demoStopPrice = 69500;
  alertPrice = '';
  selectedPair = 'btcusd';
  selectedTif = 'gtc';
  selectedAccount = 'individual';
  selectedAssets: string[] = ['BTC', 'ETH'];
  selectedOrderType = 'Limit';
  selectedTifLabel = 'GTC';
  chkReduceOnly = false;
  chkPostOnly = true;
  chkConfirm = false;
  selectedDate: Date | null = null;
  selectedDateRange: Date[] | null = null;
  paginatorPage = 0;
  activeStep = 0;
  chips = ['BTC', 'ETH', 'Spot Only', 'Filled'];

  readonly descriptions = DESCRIPTIONS;
  readonly codeMap = CODE_MAP;
  readonly sidebarGroups = SIDEBAR_GROUPS;

  // Foundations data
  foundationColors = [
    { label: 'Primary', color: '#1652f0' },
    { label: 'Buy / Green', color: '#00d47e' },
    { label: 'Sell / Red', color: '#ff637d' },
    { label: 'Warning', color: '#f0bc2a' },
    { label: 'Background', color: '#0c0e12' },
    { label: 'Surface', color: '#161a1e' },
    { label: 'Elevated', color: '#1e2329' },
    { label: 'Border', color: '#2a2d35' },
    { label: 'Text Primary', color: '#ffffff' },
    { label: 'Text Muted', color: '#8a919e' },
  ];
  typeSizes = [
    { size: 'xs', px: '10px' }, { size: 'sm', px: '11px' }, { size: 'base', px: '13px' },
    { size: 'md', px: '14px' }, { size: 'lg', px: '16px' }, { size: 'xl', px: '18px' },
    { size: '2xl', px: '24px' },
  ];
  radiusScale = [
    { name: 'sm', value: '4px' }, { name: 'md', value: '6px' }, { name: 'lg', value: '8px' },
    { name: 'xl', value: '12px' }, { name: '2xl', value: '16px' }, { name: 'full', value: '9999px' },
  ];
  shadowScale = [
    { name: 'sm', value: '0 1px 2px rgba(0,0,0,0.3)' },
    { name: 'md', value: '0 4px 6px rgba(0,0,0,0.4)' },
    { name: 'lg', value: '0 10px 15px rgba(0,0,0,0.5)' },
    { name: 'xl', value: '0 20px 25px rgba(0,0,0,0.6)' },
  ];

  // Order Entry data
  oeSide: 'Buy' | 'Sell' = 'Buy';
  oeType = 'Limit';
  oePrice = 72814.50;
  oeAmt = 0.05;
  oeStop = 72000;

  // Order Book data
  obAsks = [
    { price: 72820.00, size: '0.2341', total: '17,038', pct: 23 },
    { price: 72818.50, size: '0.5820', total: '42,381', pct: 58 },
    { price: 72816.00, size: '1.1240', total: '81,847', pct: 82 },
    { price: 72815.00, size: '0.8820', total: '64,226', pct: 68 },
    { price: 72814.50, size: '2.0000', total: '145,629', pct: 100 },
  ];
  obBids = [
    { price: 72814.00, size: '1.8500', total: '134,706', pct: 100 },
    { price: 72813.00, size: '0.9200', total: '66,988', pct: 72 },
    { price: 72810.50, size: '0.4120', total: '29,998', pct: 41 },
    { price: 72808.00, size: '0.2760', total: '20,095', pct: 28 },
    { price: 72805.00, size: '0.1200', total: '8,736', pct: 12 },
  ];

  // Price Ticker data
  ptStats = [
    { label: '24h Open', value: '$71,171.40' },
    { label: '24h High', value: '$73,200.00', color: 'var(--ds-buy)' },
    { label: '24h Low', value: '$71,100.00', color: 'var(--ds-sell)' },
    { label: '24h Volume', value: '$28.4B' },
    { label: 'Mkt Cap', value: '$1.43T' },
  ];

  // Positions Table data
  positionRows = [
    { asset: 'BTC-USD', side: 'Long', size: '0.500', entry: '$71,450.00', mark: '$72,814.50', pnl: 682.25 },
    { asset: 'ETH-USD', side: 'Long', size: '5.000', entry: '$3,520.00', mark: '$3,498.20', pnl: -109.00 },
    { asset: 'SOL-USD', side: 'Short', size: '50.000', entry: '$196.40', mark: '$191.40', pnl: 250.00 },
    { asset: '10Y TSY', side: 'Long', size: '$1MM', entry: '98-16', mark: '98-24', pnl: 2500.00 },
  ];

  // Asset List data
  assetListRows = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', price: '$72,814', change: 2.36 },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', price: '$3,498', change: 1.12 },
    { symbol: 'SOL', name: 'Solana', icon: '◎', price: '$191.40', change: -0.87 },
    { symbol: 'AVAX', name: 'Avalanche', icon: '▲', price: '$38.50', change: 4.15 },
    { symbol: 'DOT', name: 'Polkadot', icon: '●', price: '$7.82', change: 0.63 },
  ];

  // Data
  tradingPairs = [{ label: 'BTC-USD', value: 'btcusd' }, { label: 'ETH-USD', value: 'ethusd' }, { label: 'SOL-USD', value: 'solusd' }, { label: 'MATIC-USD', value: 'maticusd' }];
  tifOptions = [{ label: 'Good Till Cancelled', value: 'gtc' }, { label: 'Immediate or Cancel', value: 'ioc' }, { label: 'Fill or Kill', value: 'fok' }, { label: 'Day', value: 'day' }];
  accountTypes = [{ label: 'Individual', value: 'individual' }, { label: 'Margin', value: 'margin' }, { label: 'Options', value: 'options' }];
  assetOptions = ['BTC', 'ETH', 'SOL', 'MATIC', 'ADA', 'DOT', 'AVAX'].map(v => ({ label: v, value: v }));
  orderTypes = ['Market', 'Limit', 'Stop', 'Stop Limit'];
  tifLabels = ['GTC', 'IOC', 'FOK', 'Day'];

  preferences = [
    { label: 'Price Alerts', desc: 'Notify when price targets are hit', value: true },
    { label: 'Order Confirmations', desc: 'Show confirm dialog before placing', value: true },
    { label: 'Advanced View', desc: 'Enable full trading terminal layout', value: false },
    { label: 'Dark Mode', desc: 'Use dark trading terminal theme', value: true },
  ];

  ratedAssets = [
    { name: 'Bitcoin (BTC)', desc: 'Store of value, highest liquidity', rating: 5 },
    { name: 'Ethereum (ETH)', desc: 'Smart contract platform', rating: 4 },
    { name: 'Solana (SOL)', desc: 'High throughput L1', rating: 4 },
    { name: 'Polygon (MATIC)', desc: 'Ethereum scaling solution', rating: 3 },
  ];

  assetCards = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$72,814', change: 2.36 },
    { symbol: 'ETH', name: 'Ethereum', price: '$3,498', change: 1.12 },
    { symbol: 'SOL', name: 'Solana', price: '$191.40', change: -0.87 },
  ];

  portfolioRows = [
    { label: 'Total Value', value: '$24,830.00' },
    { label: 'Day P&L', value: '+$1,240.00', color: 'var(--ds-buy)' },
    { label: 'Unrealized P&L', value: '+$3,412.50', color: 'var(--ds-buy)' },
    { label: 'Margin Used', value: '42%' },
    { label: 'Available', value: '$14,401.40' },
  ];

  orderSummary = [
    { label: 'Pair', value: 'BTC-USD' },
    { label: 'Side', value: 'Buy' },
    { label: 'Type', value: 'Limit' },
    { label: 'Price', value: '$69,820.00' },
    { label: 'Amount', value: '0.05 BTC' },
    { label: 'Total', value: '$3,491.00' },
  ];

  drawerDetails = [
    { label: 'Order ID', value: '#4821' },
    { label: 'Pair', value: 'BTC-USD' },
    { label: 'Side', value: 'Buy', color: 'var(--ds-buy)' },
    { label: 'Type', value: 'Limit' },
    { label: 'Status', value: 'Open', color: 'var(--p-primary-color)' },
    { label: 'Price', value: '$69,820.00' },
    { label: 'Amount', value: '0.05 BTC' },
    { label: 'Filled', value: '0.00 BTC' },
    { label: 'Created', value: 'Mar 7, 2026 09:41' },
  ];

  positions = [
    { pair: 'BTC-USD', side: 'Buy', size: '0.50 BTC', entry: 68500, mark: 72814, pnl: 2157, status: 'Open' },
    { pair: 'ETH-USD', side: 'Buy', size: '2.00 ETH', entry: 3200, mark: 3498, pnl: 596, status: 'Open' },
    { pair: 'SOL-USD', side: 'Sell', size: '10 SOL', entry: 200, mark: 191.40, pnl: 86, status: 'Open' },
    { pair: 'MATIC-USD', side: 'Buy', size: '500 MATIC', entry: 0.85, mark: 0.74, pnl: -55, status: 'Open' },
  ];

  treeNodes: TreeNode[] = [
    { label: 'Crypto', icon: 'pi pi-bitcoin', expanded: true, children: [
      { label: 'Bitcoin', icon: 'pi pi-circle', expanded: true, children: [
        { label: 'BTC-USD Spot', icon: 'pi pi-tag' },
        { label: 'BTC-USD Perp', icon: 'pi pi-tag' },
      ]},
      { label: 'Ethereum', icon: 'pi pi-circle', children: [
        { label: 'ETH-USD Spot', icon: 'pi pi-tag' },
        { label: 'ETH-USD Perp', icon: 'pi pi-tag' },
      ]},
      { label: 'Solana', icon: 'pi pi-circle', children: [
        { label: 'SOL-USD Spot', icon: 'pi pi-tag' },
      ]},
    ]},
    { label: 'Forex', icon: 'pi pi-globe', children: [
      { label: 'EUR-USD', icon: 'pi pi-tag' },
      { label: 'GBP-USD', icon: 'pi pi-tag' },
    ]},
  ];

  timelineEvents = [
    { status: 'Order Placed', date: '09:41:02', detail: 'Buy 0.05 BTC @ $69,820 (Limit)', icon: 'pi pi-send', color: 'var(--p-primary-color)' },
    { status: 'Order Accepted', date: '09:41:03', detail: 'Matched in order book', icon: 'pi pi-check', color: 'var(--ds-buy)' },
    { status: 'Partial Fill', date: '09:41:15', detail: '0.03 BTC filled @ $69,820', icon: 'pi pi-arrow-right', color: 'var(--ds-buy)' },
    { status: 'Fully Filled', date: '09:42:08', detail: '0.05 BTC filled @ $69,820', icon: 'pi pi-check-circle', color: 'var(--ds-buy)' },
  ];

  progressItems = [
    { label: 'BTC Allocation', value: 72 },
    { label: 'ETH Allocation', value: 21 },
    { label: 'SOL Allocation', value: 7 },
    { label: 'Order Fill Progress', value: 65 },
    { label: 'Margin Used', value: 42 },
  ];

  traders = [
    { name: 'Alex Rivera', initials: 'AR', role: 'Head Trader', color: 'var(--p-primary-color)' },
    { name: 'Jordan Kim', initials: 'JK', role: 'Quantitative Analyst', color: 'var(--ds-buy)' },
    { name: 'Morgan Chen', initials: 'MC', role: 'Risk Manager', color: 'var(--ds-sell)' },
  ];

  breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [{ label: 'Trading' }, { label: 'Markets' }, { label: 'BTC-USD' }];
  breadcrumbItems2: MenuItem[] = [{ label: 'Portfolio' }, { label: 'Positions' }];

  menuItems: MenuItem[] = [
    { label: 'Order Actions', items: [
      { label: 'View Details', icon: 'pi pi-eye' },
      { label: 'Modify Order', icon: 'pi pi-pencil' },
      { label: 'Duplicate', icon: 'pi pi-copy' },
    ]},
    { separator: true },
    { label: 'Cancel Order', icon: 'pi pi-times', styleClass: 'text-danger' },
  ];

  menubarItems: MenuItem[] = [
    { label: 'File', icon: 'pi pi-file', items: [
      { label: 'New Order', icon: 'pi pi-plus', shortcut: '⌘N' },
      { separator: true },
      { label: 'Export CSV', icon: 'pi pi-download' },
    ]},
    { label: 'View', icon: 'pi pi-eye', items: [
      { label: 'Chart', icon: 'pi pi-chart-line', shortcut: '⌘1' },
      { label: 'Order Book', icon: 'pi pi-list', shortcut: '⌘2' },
      { label: 'Trade History', icon: 'pi pi-history', shortcut: '⌘3' },
    ]},
    { label: 'Trade', icon: 'pi pi-arrow-right-arrow-left', items: [
      { label: 'Buy BTC', icon: 'pi pi-arrow-up' },
      { label: 'Sell BTC', icon: 'pi pi-arrow-down' },
      { separator: true },
      { label: 'Cancel All Orders', icon: 'pi pi-ban' },
    ]},
  ];

  stepsItems: MenuItem[] = [
    { label: 'Select Pair' },
    { label: 'Order Details' },
    { label: 'Confirm' },
  ];

  faqs = [
    { q: 'What are the trading fees?', a: '0.00% maker and 0.05% taker for standard accounts. VIP tiers offer further discounts based on 30-day volume.' },
    { q: 'How does margin trading work?', a: 'Margin trading allows you to trade with leverage up to 10x your collateral. Liquidation is triggered at 80% margin utilization.' },
    { q: 'How do I withdraw funds?', a: 'Navigate to Wallet → Withdraw. Processing takes 1–2 business days. Minimum withdrawal is $10.' },
    { q: 'What order types are supported?', a: 'Market, Limit, Stop, Stop-Limit, Trailing Stop, and TWAP orders are all supported on spot and perpetual markets.' },
  ];

  carouselItems = [
    { symbol: 'BTC', price: '$72,814', change: 2.36 },
    { symbol: 'ETH', price: '$3,498', change: 1.12 },
    { symbol: 'SOL', price: '$191.40', change: -0.87 },
    { symbol: 'MATIC', price: '$0.74', change: -3.21 },
    { symbol: 'AVAX', price: '$38.50', change: 4.15 },
    { symbol: 'DOT', price: '$7.82', change: 0.63 },
  ];

  speedDialItems: MenuItem[] = [
    { label: 'Buy', icon: 'pi pi-arrow-up', command: () => this.showToast('success', 'Buy Order', 'Buy dialog opened') },
    { label: 'Sell', icon: 'pi pi-arrow-down', command: () => this.showToast('error', 'Sell Order', 'Sell dialog opened') },
    { label: 'Alert', icon: 'pi pi-bell', command: () => this.showToast('warn', 'Alert', 'Price alert dialog opened') },
    { label: 'Refresh', icon: 'pi pi-refresh', command: () => this.showToast('info', 'Refreshed', 'Market data updated') },
  ];

  btcStats = [
    { label: 'Price', value: '$72,814', color: 'var(--ds-foreground)' },
    { label: '24h Change', value: '+2.36%', color: 'var(--ds-buy)' },
    { label: '24h High', value: '$73,200' },
    { label: '24h Low', value: '$71,100' },
    { label: 'Volume', value: '$28.4B' },
  ];

  introFeatures = [
    { icon: 'pi pi-palette', title: 'Coinbase Design', desc: 'Blue primary, green/red buy/sell, dark terminal aesthetics.' },
    { icon: 'pi pi-moon', title: 'Dark & Light', desc: 'Full dark mode via .dark-mode class, optimized for trading.' },
    { icon: 'pi pi-sliders-h', title: 'TradingPreset', desc: 'Custom PrimeNG Aura preset with all design tokens applied.' },
  ];

  colorSwatches = [
    { name: 'Primary', value: '#1652f0' },
    { name: 'Background', value: '#0c0e12' },
    { name: 'Surface', value: '#161a1e' },
    { name: 'Elevated', value: '#1e2329' },
    { name: 'Border', value: '#2a2d35' },
    { name: 'Buy', value: '#00d47e' },
    { name: 'Sell', value: '#ff637d' },
    { name: 'Warning', value: '#f0bc2a' },
    { name: 'Muted', value: '#5b616e' },
  ];

  constructor(
    public themeService: ThemeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {}

  filteredGroups() {
    if (!this.searchQuery) return this.sidebarGroups;
    const q = this.searchQuery.toLowerCase();
    return this.sidebarGroups
      .map(g => ({ ...g, items: g.items.filter(i => i.toLowerCase().includes(q)) }))
      .filter(g => g.items.length > 0);
  }

  select(comp: string) {
    this.selectedComp.set(comp);
    this.docTab.set('preview');
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 4000 });
  }

  showTradeToast() {
    this.messageService.add({ severity: 'success', summary: 'Order Filled', detail: 'Bought 0.05 BTC at $69,820.00', life: 5000 });
  }

  showAlertToast() {
    this.messageService.add({ severity: 'warn', summary: 'Alert Created', detail: `Price alert set at $${this.alertPrice}`, life: 4000 });
  }

  confirmCancel() {
    this.confirmationService.confirm({
      message: 'This will cancel your BTC-USD limit order at $69,820. This action cannot be undone.',
      header: 'Cancel Order?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, cancel order',
      rejectLabel: 'Keep order',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.showToast('info', 'Order Cancelled', 'BTC-USD limit order has been cancelled.'),
    });
  }

  confirmClose() {
    this.confirmationService.confirm({
      message: 'Closing this position will execute a market sell of 0.50 BTC at current market price.',
      header: 'Close Position?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Close Position',
      rejectLabel: 'Keep Open',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => this.showToast('success', 'Position Closed', 'Sold 0.50 BTC at market price.'),
    });
  }

  removeChip(chip: string) {
    this.chips = this.chips.filter(c => c !== chip);
  }

  onPageChange(event: { page?: number }) {
    this.paginatorPage = event.page ?? 0;
  }

  copyCode() {
    const code = this.codeMap[this.selectedComp()] ?? '';
    navigator.clipboard.writeText(code);
    this.showToast('info', 'Copied', 'Code copied to clipboard');
  }
}
