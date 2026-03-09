# MarketsUI Design Tokens

Reference guide for using the MarketsUI token system in React (shadcn/ui + Tailwind v4) and Angular (PrimeNG).

---

## Token Files

```
tokens/
  color/primitives.tokens.json      — raw color scales (neutral, blue, green, red, amber)
  color/semantic-light.tokens.json  — light mode semantic mappings
  color/semantic-dark.tokens.json   — dark mode semantic mappings
  typography.tokens.json            — font families, sizes, weights, line heights
  spacing.tokens.json               — spacing scale
  radius.tokens.json                — border radius scale
  shadows.tokens.json               — elevation + glow effects
```

> The JSON files are the framework-agnostic source of truth. Both framework implementations below
> hand-map these values into their respective CSS variable / theme systems.

---

## Color Tokens

### Primitive Palette

| Token | Value | Usage |
|-------|-------|-------|
| `neutral.0` | `#ffffff` | Pure white |
| `neutral.50` | `#fafafa` | App background (light) |
| `neutral.950` | `#0c0e12` | App background (dark) |
| `blue.500` | `#1652f0` | Primary brand blue |
| `green.500` | `#05b169` | Buy / long (light) |
| `green.600` | `#00d47e` | Buy / long (dark) |
| `red.500` | `#cf202f` | Sell / short (light) |
| `red.400` | `#ff637d` | Sell / short (dark) |

### Semantic Tokens — Light Mode

| Token | Value | Description |
|-------|-------|-------------|
| `background.app` | `#fafafa` | Page background |
| `background.surface` | `#ffffff` | Card / panel surface |
| `background.elevated` | `#f5f5f5` | Elevated surface |
| `text.primary` | `#050f19` | Primary text |
| `text.secondary` | `#5b616e` | Secondary / label text |
| `text.muted` | `#8a919e` | Placeholder / disabled text |
| `border.default` | `#e8eaed` | Standard border |
| `action.buy` | `#05b169` | Buy action |
| `action.sell` | `#cf202f` | Sell action |
| `action.warning` | `#d97706` | Warning state |
| `primary.default` | `#1652f0` | Primary CTA |

### Semantic Tokens — Dark Mode

| Token | Value | Description |
|-------|-------|-------------|
| `background.app` | `#0c0e12` | Page background |
| `background.surface` | `#161a1e` | Card / panel surface |
| `background.elevated` | `#1e2329` | Elevated surface |
| `text.primary` | `#ffffff` | Primary text |
| `text.secondary` | `#8a919e` | Secondary / label text |
| `text.muted` | `#5b616e` | Placeholder / disabled text |
| `border.default` | `#2a2d35` | Standard border |
| `action.buy` | `#00d47e` | Buy action |
| `action.buyRow` | `rgba(0,212,126,0.04)` | Buy row tint |
| `action.sell` | `#ff637d` | Sell action |
| `action.sellRow` | `rgba(255,99,125,0.04)` | Sell row tint |
| `primary.default` | `#1652f0` | Primary CTA |

---

## Typography Tokens

| Token | Value |
|-------|-------|
| `fontFamily.sans` | `'Inter', system-ui, -apple-system, sans-serif` |
| `fontFamily.mono` | `'JetBrains Mono', 'Fira Code', monospace` |
| `fontSize.xs` | `0.6875rem` (11px) |
| `fontSize.sm` | `0.75rem` (12px) |
| `fontSize.base` | `0.8125rem` (13px) — body default |
| `fontSize.lg` | `0.9375rem` (15px) |
| `fontSize.xl` | `1.125rem` (18px) |
| `fontWeight.medium` | `500` |
| `fontWeight.semibold` | `600` |
| `lineHeight.tight` | `1.25` |
| `lineHeight.normal` | `1.5` |

---

## Spacing Tokens

| Token | Value |
|-------|-------|
| `spacing.1` | `0.25rem` (4px) |
| `spacing.2` | `0.5rem` (8px) |
| `spacing.3` | `0.75rem` (12px) |
| `spacing.4` | `1rem` (16px) |
| `spacing.6` | `1.5rem` (24px) |
| `spacing.8` | `2rem` (32px) |

---

## Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `radius.sm` | `4px` | Badges, small chips |
| `radius.md` | `6px` | Inputs, base UI |
| `radius.lg` | `8px` | Cards, dropdowns |
| `radius.xl` | `12px` | Panels, modals |
| `radius.2xl` | `16px` | Large modals |
| `radius.full` | `9999px` | Pill buttons, avatars |

---

## Shadow Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `shadow.sm` | `0 1px 3px rgba(0,0,0,0.12)` | Subtle lift |
| `shadow.md` | `0 4px 12px rgba(0,0,0,0.15)` | Cards, dropdowns |
| `shadow.lg` | `0 8px 24px rgba(0,0,0,0.20)` | Modals, floating panels |
| `shadow.xl` | `0 16px 48px rgba(0,0,0,0.25)` | Overlays |
| `shadow.glow-buy` | `0 0 12px rgba(0,212,126,0.3)` | Buy action highlight |
| `shadow.glow-sell` | `0 0 12px rgba(255,99,125,0.3)` | Sell action highlight |

---

---

# React — shadcn/ui + Tailwind v4

## Setup

Tokens are consumed via CSS custom properties defined in `react-app/src/styles/globals.css`.
Tailwind v4 maps these via `@theme inline` so they become utility classes automatically.

```css
/* globals.css excerpt */
:root {
  --background: #fafafa;
  --foreground: #050f19;
  --card: #ffffff;
  --primary: #1652f0;
  --buy: #05b169;
  --sell: #cf202f;
  --radius: 6px;
  /* ... */
}

.dark {
  --background: #0c0e12;
  --foreground: #ffffff;
  --card: #161a1e;
  --buy: #00d47e;
  --sell: #ff637d;
  /* ... */
}

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  --color-buy: var(--buy);
  --color-sell: var(--sell);
  /* ... */
}
```

Dark mode is toggled by adding/removing the `.dark` class on `<html>`.
The `ThemeProvider` at `react-app/src/components/theme/ThemeProvider.tsx` handles this.

---

## Using Tokens in Components

### Colors via Tailwind utilities

```tsx
// Background & text
<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground" />

// Primary
<button className="bg-primary text-primary-foreground hover:bg-primary/90" />

// Muted / secondary
<span className="text-muted-foreground" />
<div className="bg-secondary" />

// Trading colors
<span className="text-buy">+2.5%</span>
<span className="text-sell">-1.2%</span>
<div className="bg-buy/10 border border-buy/20" />   {/* tinted buy card */}
<div className="bg-sell/10 border border-sell/20" /> {/* tinted sell card */}

// Border & input
<div className="border border-border" />
<input className="bg-input border border-border" />
```

### Border radius via Tailwind utilities

```tsx
// Maps to --radius-sm/md/lg/xl/2xl/full from @theme inline
<div className="rounded-sm" />   {/* 4px  */}
<div className="rounded-md" />   {/* 6px  */}
<div className="rounded-lg" />   {/* 8px  */}
<div className="rounded-xl" />   {/* 12px */}
<div className="rounded-2xl" />  {/* 16px */}
<div className="rounded-full" /> {/* pill */}
```

### Typography

```tsx
// Font families
<p className="font-sans" />   {/* Inter */}
<code className="font-mono" /> {/* JetBrains Mono */}

// Sizes (Tailwind defaults re-mapped to 13px base)
<span className="text-xs" />   {/* 11px */}
<span className="text-sm" />   {/* 12px */}
<span className="text-base" /> {/* 13px */}
```

### Accessing tokens directly in CSS-in-JS / inline styles

```tsx
// Use CSS variable references when Tailwind utilities aren't available
// (e.g. inside AG Grid cellStyle callbacks)
cellStyle: (params) => ({
  color: params.value > 0 ? 'var(--color-buy)' : 'var(--color-sell)',
})

// Or in Recharts / other charting libraries
<Line stroke="var(--color-primary)" />
<CartesianGrid stroke="var(--color-border)" strokeOpacity={0.4} />
```

---

## shadcn/ui Component Examples

### Button

```tsx
import { Button } from '@/components/ui/button'

// Uses --primary token
<Button variant="default">Submit Order</Button>

// Custom trading variants (defined in button.tsx)
<Button variant="buy">Buy / Long</Button>
<Button variant="sell">Sell / Short</Button>

// Sizes
<Button size="sm">Compact</Button>
<Button size="lg">Large CTA</Button>
<Button size="icon"><Plus /></Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

// bg-card, border-border, rounded-xl applied automatically
<Card>
  <CardHeader>
    <CardTitle>Yield Curve</CardTitle>
    <CardDescription>Today vs prior session</CardDescription>
  </CardHeader>
  <CardContent>
    {/* chart / content */}
  </CardContent>
</Card>
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">Active</Badge>
<Badge variant="destructive">Cancelled</Badge>

// Custom trading badges using token classes directly
<span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-buy/15 text-buy">
  BUY
</span>
<span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-sell/15 text-sell">
  SELL
</span>
```

### Input

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// bg-input, border-border, rounded-lg, focus:ring-primary applied automatically
<div className="space-y-1.5">
  <Label>Face Value ($MM)</Label>
  <Input type="number" placeholder="10" className="font-mono" />
</div>
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="rates">
  <TabsList>
    <TabsTrigger value="rates">Rates</TabsTrigger>
    <TabsTrigger value="credit">Credit</TabsTrigger>
    <TabsTrigger value="futures">Futures</TabsTrigger>
  </TabsList>
  <TabsContent value="rates">
    {/* content */}
  </TabsContent>
</Tabs>
```

### Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

<Dialog open={open} onClose={onClose}>
  <DialogContent className="w-[480px] max-h-[90vh] overflow-y-auto">
    <DialogHeader onClose={onClose}>
      <DialogTitle>New Order</DialogTitle>
      <DialogDescription>Fixed Income · RFQ / Limit</DialogDescription>
    </DialogHeader>
    {/* form content */}
  </DialogContent>
</Dialog>
```

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

<Alert variant="default">
  <AlertTitle>Order Filled</AlertTitle>
  <AlertDescription>UST 10Y 25MM filled at 4.380%</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Order Rejected</AlertTitle>
  <AlertDescription>Insufficient margin.</AlertDescription>
</Alert>
```

---

## AG Grid Theme

The `marketsUITheme` in `react-app/src/components/trading/fi/agGridTheme.ts` applies
tokens to AG Grid via parameter-based theming. Light/dark is switched by
`document.documentElement.dataset.agThemeMode` (set by `ThemeProvider`).

```tsx
import { AgGridReact } from 'ag-grid-react'
import { marketsUITheme } from '@/components/trading/fi/agGridTheme'

<AgGridReact
  theme={marketsUITheme}
  rowData={data}
  columnDefs={colDefs}
  style={{ height: '100%', width: '100%' }}
/>
```

For colored cells reference CSS variables directly in `cellStyle`:

```tsx
{
  field: 'change',
  cellStyle: (p) => ({
    color: p.value < 0 ? 'var(--color-buy)' : p.value > 0 ? 'var(--color-sell)' : undefined,
  }),
}
```

---

---

# Angular — PrimeNG (Aura preset)

## Setup

Tokens are consumed via two mechanisms:

1. **`--ds-*` CSS variables** in `angular-app/src/styles.scss` — used directly in templates and SCSS
2. **PrimeNG `TradingPreset`** in `angular-app/src/app/theme/trading-preset.ts` — maps tokens into PrimeNG's Aura design token system

Dark mode is toggled by adding/removing the `.dark-mode` class on `<html>`.

```scss
/* styles.scss excerpt */
:root {
  --ds-background:         #fafafa;
  --ds-foreground:         #050f19;
  --ds-card:               #ffffff;
  --ds-primary:            #1652f0;
  --ds-buy:                #05b169;
  --ds-sell:               #cf202f;
  --ds-font-mono:          'JetBrains Mono Variable', monospace;
}

html.dark-mode {
  --ds-background:         #0c0e12;
  --ds-foreground:         #ffffff;
  --ds-card:               #161a1e;
  --ds-buy:                #00d47e;
  --ds-sell:               #ff637d;
}
```

---

## Using Tokens in Templates

### Inline styles

```html
<!-- Background & text -->
<div [style.background]="'var(--ds-card)'" [style.color]="'var(--ds-foreground)'">
  Panel content
</div>

<!-- Trading colors -->
<span [style.color]="position.pnl > 0 ? 'var(--ds-buy)' : 'var(--ds-sell)'">
  {{ position.pnl | currency }}
</span>
```

### SCSS in component stylesheets

```scss
// my-component.component.scss
.price-cell {
  font-family: var(--ds-font-mono);
  color: var(--ds-foreground);
}

.buy-badge {
  background: rgba(var(--ds-buy-rgb, 0,212,126), 0.12);
  color: var(--ds-buy);
  border-radius: 9999px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
}

.sell-badge {
  background: rgba(var(--ds-sell-rgb, 255,99,125), 0.12);
  color: var(--ds-sell);
  border-radius: 9999px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
}
```

---

## PrimeNG Component Examples

### Button

```html
<!-- Maps to --ds-primary via TradingPreset -->
<p-button label="Submit Order" severity="primary" [rounded]="true" />

<!-- Trading variants using styleClass -->
<p-button label="Buy / Long"   styleClass="p-button-buy" />
<p-button label="Sell / Short" styleClass="p-button-sell" />
<p-button label="Cancel"       severity="secondary" [outlined]="true" [rounded]="true" />
```

```scss
// Override in styles.scss or component stylesheet
.p-button-buy {
  background: var(--ds-buy) !important;
  border-color: var(--ds-buy) !important;
  color: #fff !important;
  border-radius: 9999px;
}
.p-button-sell {
  background: var(--ds-sell) !important;
  border-color: var(--ds-sell) !important;
  color: #fff !important;
  border-radius: 9999px;
}
```

### Card

```html
<!-- bg-card, border-border applied via TradingPreset -->
<p-card>
  <ng-template pTemplate="header">
    <div class="card-header">Yield Curve</div>
  </ng-template>
  <ng-template pTemplate="content">
    <!-- chart / content -->
  </ng-template>
</p-card>
```

### InputText / InputNumber

```html
<!-- Styled via TradingPreset form field tokens -->
<div class="field">
  <label for="faceValue">Face Value ($MM)</label>
  <p-inputNumber
    inputId="faceValue"
    [ngModel]="faceValue"
    (ngModelChange)="faceValue = $event"
    mode="decimal"
    [minFractionDigits]="0"
    styleClass="font-mono w-full"
  />
</div>
```

### Dropdown / Select

```html
<p-dropdown
  [options]="venues"
  [(ngModel)]="selectedVenue"
  placeholder="Select Venue"
  styleClass="w-full"
/>
```

### Tabs

```html
<p-tabView>
  <p-tabPanel header="IG Bonds">
    <!-- bond grid -->
  </p-tabPanel>
  <p-tabPanel header="HY Bonds">
    <!-- bond grid -->
  </p-tabPanel>
  <p-tabPanel header="CDX / CDS">
    <!-- cdx grid -->
  </p-tabPanel>
</p-tabView>
```

### Dialog

```html
<p-dialog
  header="New Order"
  [(visible)]="ticketOpen"
  [modal]="true"
  [dismissableMask]="true"
  [style]="{ width: '480px', maxHeight: '90vh' }"
  [contentStyle]="{ overflowY: 'auto' }"
>
  <!-- order form content -->
</p-dialog>
```

### Tag / Badge

```html
<!-- Built-in severity -->
<p-tag value="FILLED"    severity="success" />
<p-tag value="CANCELLED" severity="danger" />
<p-tag value="WORKING"   severity="warn" />

<!-- Custom trading side badge -->
<p-tag
  [value]="order.side === 'Buy' ? 'BUY' : 'SELL'"
  [styleClass]="order.side === 'Buy' ? 'tag-buy' : 'tag-sell'"
/>
```

```scss
.tag-buy {
  background: rgba(0, 212, 126, 0.12);
  color: var(--ds-buy);
  border-radius: 9999px;
}
.tag-sell {
  background: rgba(255, 99, 125, 0.12);
  color: var(--ds-sell);
  border-radius: 9999px;
}
```

### DataTable

```html
<p-table
  [value]="orders"
  [rowHover]="true"
  styleClass="p-datatable-sm"
  [scrollable]="true"
  scrollHeight="flex"
>
  <ng-template pTemplate="header">
    <tr>
      <th>Security</th>
      <th pSortableColumn="side">Side <p-sortIcon field="side" /></th>
      <th pSortableColumn="faceValueMM">Size $MM <p-sortIcon field="faceValueMM" /></th>
      <th pSortableColumn="limitYield">Limit Yield <p-sortIcon field="limitYield" /></th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-order>
    <tr>
      <td class="font-mono">{{ order.security }}</td>
      <td>
        <p-tag
          [value]="order.side.toUpperCase()"
          [styleClass]="order.side === 'Buy' ? 'tag-buy' : 'tag-sell'"
        />
      </td>
      <td class="font-mono">{{ order.faceValueMM }}</td>
      <td class="font-mono" [style.color]="'var(--ds-buy)'">
        {{ order.limitYield | number:'1.3-3' }}%
      </td>
    </tr>
  </ng-template>
</p-table>
```

### Toast / Notifications

```html
<!-- app.component.html -->
<p-toast />

<!-- Trigger from service -->
```

```ts
// my-component.component.ts
import { MessageService } from 'primeng/api'

constructor(private msg: MessageService) {}

onOrderSubmit() {
  this.msg.add({
    severity: 'success',
    summary: 'Order Submitted',
    detail: 'UST 10Y 25MM submitted at 4.380%',
    life: 4000,
  })
}
```

---

## Token Reference Quick-Card

| Design Token | React (Tailwind class) | React (CSS var) | Angular (CSS var) |
|---|---|---|---|
| App background | `bg-background` | `var(--color-background)` | `var(--ds-background)` |
| Card surface | `bg-card` | `var(--color-card)` | `var(--ds-card)` |
| Primary text | `text-foreground` | `var(--color-foreground)` | `var(--ds-foreground)` |
| Muted text | `text-muted-foreground` | `var(--color-muted-foreground)` | `var(--ds-muted-foreground)` |
| Primary blue | `bg-primary` | `var(--color-primary)` | `var(--ds-primary)` |
| Border | `border-border` | `var(--color-border)` | `var(--ds-border)` |
| Buy / green | `text-buy` / `bg-buy` | `var(--color-buy)` | `var(--ds-buy)` |
| Sell / red | `text-sell` / `bg-sell` | `var(--color-sell)` | `var(--ds-sell)` |
| Warning | `text-warning` | `var(--color-warning)` | `var(--ds-warning)` |
| Monospace font | `font-mono` | `var(--font-mono)` | `var(--ds-font-mono)` |
| Pill radius | `rounded-full` | `var(--radius-full)` | `border-radius: 9999px` |
| Card radius | `rounded-xl` | `var(--radius-xl)` | `border-radius: 12px` |
