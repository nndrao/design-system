import { useState } from 'react'
import {
  Info, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown,
  Bell, Search, Settings, ChevronRight, Zap, ArrowUpRight, ArrowDownRight,
  Copy, Eye, EyeOff, Plus, RefreshCw,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Tooltip } from '@/components/ui/tooltip'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'

/* ─── Section wrapper ─────────────────────────────────────── */
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <Separator className="mb-4" />
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

/* ─── Color Swatch ─────────────────────────────────────────── */
function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="h-10 w-16 rounded-lg border border-border shadow-sm" style={{ background: color }} />
      <span className="text-[10px] text-muted-foreground font-mono">{label}</span>
      <span className="text-[10px] text-muted-foreground">{color}</span>
    </div>
  )
}

/* ─── Mock order book rows ─────────────────────────────────── */
const ASKS = [
  { price: '69,842.10', size: '0.4821', total: '33,680' },
  { price: '69,835.50', size: '1.2033', total: '84,157' },
  { price: '69,829.00', size: '0.7764', total: '54,234' },
  { price: '69,820.25', size: '2.1500', total: '150,263' },
]
const BIDS = [
  { price: '69,812.00', size: '0.9341', total: '65,300' },
  { price: '69,805.75', size: '1.6670', total: '116,600' },
  { price: '69,798.50', size: '0.3218', total: '22,499' },
  { price: '69,791.00', size: '2.8800', total: '201,237' },
]

/* ─── Mock positions table data ────────────────────────────── */
const POSITIONS = [
  { symbol: 'BTC-USD', side: 'Long',  qty: '0.5000', entry: '68,200.00', mark: '69,820.00', pnl: '+$810.00', pnlPct: '+1.19%', positive: true },
  { symbol: 'ETH-USD', side: 'Short', qty: '2.0000', entry: '3,550.00',  mark: '3,495.00',  pnl: '+$110.00', pnlPct: '+1.55%', positive: true },
  { symbol: 'SOL-USD', side: 'Long',  qty: '10.000', entry: '198.50',    mark: '191.25',    pnl: '-$72.50',  pnlPct: '-3.65%', positive: false },
]

/* ════════════════════════════════════════════════════════════ */
export function ComponentShowcase() {
  const [showcaseTab, setShowcaseTab] = useState('foundations')
  const [formTab, setFormTab] = useState('limit')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [switchOn, setSwitchOn] = useState(true)
  const [checked, setChecked] = useState(true)
  const [showPw, setShowPw] = useState(false)
  const [progress] = useState(68)

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Page header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Component Showcase</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">All UI primitives rendered with the MarketsUI design system</p>
        </div>
        <Badge variant="secondary" className="text-[10px]">shadcn/React · Tailwind v4</Badge>
      </div>

      <div className="px-6 py-6 max-w-5xl">
        {/* Top-level tabs */}
        <Tabs value={showcaseTab} onValueChange={setShowcaseTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="foundations">Foundations</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          {/* ── FOUNDATIONS ── */}
          <TabsContent value="foundations">
            <Section title="Color Palette" description="Core design tokens – light and dark adaptive">
              <Row label="Primary">
                <Swatch color="#1652f0" label="primary" />
                <Swatch color="#4570ff" label="primary-hover" />
                <Swatch color="#c4d4ff" label="primary-100" />
                <Swatch color="#ebf0ff" label="primary-50" />
              </Row>
              <Row label="Buy / Positive">
                <Swatch color="var(--buy)" label="buy" />
                <Swatch color="var(--buy-muted)" label="buy-muted" />
              </Row>
              <Row label="Sell / Negative">
                <Swatch color="var(--sell)" label="sell" />
                <Swatch color="var(--sell-muted)" label="sell-muted" />
              </Row>
              <Row label="Surfaces">
                <Swatch color="var(--background)" label="background" />
                <Swatch color="var(--card)" label="card" />
                <Swatch color="var(--elevated)" label="elevated" />
                <Swatch color="var(--accent)" label="accent" />
                <Swatch color="var(--border)" label="border" />
              </Row>
              <Row label="Text">
                <div className="flex items-center gap-1 px-3 py-1 rounded border border-border">
                  <span className="text-xs text-foreground">Primary</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded border border-border">
                  <span className="text-xs text-muted-foreground">Secondary</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded border border-border">
                  <span className="text-xs text-muted-foreground/60">Muted</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded border border-border">
                  <span className="text-xs text-buy">Buy</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded border border-border">
                  <span className="text-xs text-sell">Sell</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded border border-border">
                  <span className="text-xs text-warning">Warning</span>
                </div>
              </Row>
            </Section>

            <Section title="Typography" description="Inter (sans) + JetBrains Mono for prices">
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-foreground font-mono">$69,820.50</span>
                  <Badge variant="buy">+2.34%</Badge>
                </div>
                <p className="text-xl font-semibold text-foreground">Section Heading — 20px/600</p>
                <p className="text-sm font-medium text-foreground">Subheading — 14px/500</p>
                <p className="text-xs text-foreground">Body text — 13px/400. The quick brown fox jumps over the lazy dog.</p>
                <p className="text-xs text-muted-foreground">Secondary text — muted foreground. Supporting detail and labels.</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Caption / Label — 11px</p>
                <div className="flex gap-6">
                  <span className="font-mono text-xs text-buy">+$810.00</span>
                  <span className="font-mono text-xs text-sell">−$72.50</span>
                  <span className="font-mono text-xs text-foreground">0.00042831 BTC</span>
                  <span className="font-mono text-xs text-muted-foreground">Vol: 1.23B</span>
                </div>
              </div>
            </Section>

            <Section title="Spacing & Radius" description="4px base grid · radius scale from 4px to full pill">
              <div className="flex flex-wrap gap-3 items-end">
                {[
                  { r: 'rounded',    label: 'sm · 4px' },
                  { r: 'rounded-md', label: 'md · 6px' },
                  { r: 'rounded-lg', label: 'lg · 8px' },
                  { r: 'rounded-xl', label: 'xl · 12px' },
                  { r: 'rounded-2xl',label: '2xl · 16px' },
                  { r: 'rounded-full',label: 'full' },
                ].map(({ r, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className={cn('h-10 w-16 bg-primary/20 border border-primary/40', r)} />
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Shadows">
              <div className="flex flex-wrap gap-4">
                {[
                  { cls: 'shadow-sm',  label: 'sm' },
                  { cls: 'shadow-md',  label: 'md' },
                  { cls: 'shadow-lg',  label: 'lg' },
                  { cls: 'shadow-xl',  label: 'xl' },
                ].map(({ cls, label }) => (
                  <div key={label} className={cn('h-12 w-24 rounded-xl bg-card border border-border flex items-center justify-center text-[11px] text-muted-foreground', cls)}>
                    {label}
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* ── COMPONENTS ── */}
          <TabsContent value="components">
            {/* Buttons */}
            <Section title="Buttons" description="All variants and sizes">
              <Row label="Variants">
                <Button variant="default">Buy BTC</Button>
                <Button variant="secondary">Convert</Button>
                <Button variant="outline">Transfer</Button>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Close Position</Button>
                <Button variant="buy"><TrendingUp />Buy</Button>
                <Button variant="sell"><TrendingDown />Sell</Button>
                <Button variant="link">Learn more →</Button>
              </Row>
              <Row label="Sizes">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large (Pill)</Button>
              </Row>
              <Row label="States">
                <Button>Active</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
                <Button variant="buy" size="lg" className="min-w-32">
                  <Zap />Review Order
                </Button>
              </Row>
              <Row label="Icon buttons">
                <Button size="icon" variant="outline"><Bell /></Button>
                <Button size="icon" variant="ghost"><Search /></Button>
                <Button size="icon" variant="ghost"><Settings /></Button>
                <Button size="icon" variant="ghost"><RefreshCw /></Button>
                <Button size="icon" variant="outline"><Copy /></Button>
              </Row>
            </Section>

            {/* Badges */}
            <Section title="Badges" description="Status indicators and labels">
              <Row label="Variants">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Pending</Badge>
                <Badge variant="outline">Draft</Badge>
                <Badge variant="buy">+2.34%</Badge>
                <Badge variant="sell">−1.87%</Badge>
                <Badge variant="warning">Margin Call</Badge>
                <Badge variant="muted">Closed</Badge>
              </Row>
              <Row label="With icons">
                <Badge variant="buy"><ArrowUpRight className="size-2.5" />Long</Badge>
                <Badge variant="sell"><ArrowDownRight className="size-2.5" />Short</Badge>
                <Badge variant="secondary"><Zap className="size-2.5" />Advanced</Badge>
              </Row>
            </Section>

            {/* Form inputs */}
            <Section title="Form Controls" description="Input fields, selects, switches, checkboxes">
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Limit Price</Label>
                  <Input id="price" placeholder="0.00" defaultValue="69,820.00" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qty">Quantity (BTC)</Label>
                  <Input id="qty" placeholder="0.00" defaultValue="0.0500" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pair">Trading Pair</Label>
                  <Select id="pair" defaultValue="btcusd">
                    <option value="btcusd">BTC-USD</option>
                    <option value="ethusd">ETH-USD</option>
                    <option value="solusd">SOL-USD</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ordertype">Order Type</Label>
                  <Select id="ordertype" defaultValue="limit">
                    <option value="limit">Limit</option>
                    <option value="market">Market</option>
                    <option value="stop">Stop Limit</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw">Password</Label>
                  <div className="relative">
                    <Input id="pw" type={showPw ? 'text' : 'password'} defaultValue="••••••••••" className="pr-8" />
                    <button onClick={() => setShowPw(p => !p)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                    <Input id="search" placeholder="Search assets…" className="pl-7" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="errInput">Amount (error state)</Label>
                  <Input id="errInput" error defaultValue="999999" />
                  <p className="text-[11px] text-destructive">Exceeds available balance</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="note">Note</Label>
                  <Textarea id="note" placeholder="Add a note to this transaction…" />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={switchOn} onChange={e => setSwitchOn(e.target.checked)} />
                  <Label>Advanced trading</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={false} />
                  <Label className="text-muted-foreground">Notifications off</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} />
                  <Label>I agree to terms</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked={false} />
                  <Label className="text-muted-foreground">Subscribe to emails</Label>
                </div>
              </div>
            </Section>

            {/* Cards */}
            <Section title="Cards" description="Surface containers with optional header and footer">
              <div className="grid grid-cols-3 gap-4 max-w-3xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Value</CardTitle>
                    <CardDescription>All accounts combined</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold font-mono text-foreground">$24,830.00</p>
                    <p className="text-xs text-buy mt-1 flex items-center gap-1"><ArrowUpRight className="size-3" />+$1,240.00 today</p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button size="sm" variant="buy" className="flex-1">Buy</Button>
                    <Button size="sm" variant="sell" className="flex-1">Sell</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>BTC-USD</CardTitle>
                    <CardDescription>Bitcoin · Perpetual</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Mark Price</span>
                      <span className="text-xs font-mono text-foreground">$69,820.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">24h Change</span>
                      <span className="text-xs font-mono text-buy">+2.34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">24h Volume</span>
                      <span className="text-xs font-mono text-foreground">$1.23B</span>
                    </div>
                    <Progress value={72} variant="buy" className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="border-dashed border-border/50">
                  <CardContent className="flex flex-col items-center justify-center h-full py-8 gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="size-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Add widget</p>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Alerts */}
            <Section title="Alerts" description="Feedback messages for system states">
              <div className="space-y-2 max-w-xl">
                <Alert variant="info">
                  <Info className="size-3.5" />
                  <AlertTitle>Fees reduced</AlertTitle>
                  <AlertDescription>Your maker fee is now 0.00% with MarketsUI Advanced.</AlertDescription>
                </Alert>
                <Alert variant="success">
                  <CheckCircle className="size-3.5" />
                  <AlertTitle>Order filled</AlertTitle>
                  <AlertDescription>Bought 0.05 BTC at $69,820.00. Total: $3,491.00</AlertDescription>
                </Alert>
                <Alert variant="warning">
                  <AlertTriangle className="size-3.5" />
                  <AlertTitle>Margin warning</AlertTitle>
                  <AlertDescription>Your margin ratio is at 85%. Consider adding collateral.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <XCircle className="size-3.5" />
                  <AlertTitle>Liquidation risk</AlertTitle>
                  <AlertDescription>Position will be liquidated at $67,400.00. Add margin now.</AlertDescription>
                </Alert>
              </div>
            </Section>

            {/* Progress */}
            <Section title="Progress" description="Linear progress bars for fills, ratios, and loading">
              <div className="space-y-3 max-w-sm">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Order fill</span><span>{progress}%</span>
                  </div>
                  <Progress value={progress} variant="default" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Portfolio up</span><span>72%</span>
                  </div>
                  <Progress value={72} variant="buy" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Drawdown</span><span>28%</span>
                  </div>
                  <Progress value={28} variant="sell" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Margin used</span><span>85%</span>
                  </div>
                  <Progress value={85} variant="warning" />
                </div>
              </div>
            </Section>

            {/* Skeleton */}
            <Section title="Skeleton" description="Loading placeholders">
              <div className="space-y-2 max-w-sm">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center gap-3 mt-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </Section>

            {/* Avatar */}
            <Section title="Avatars">
              <Row label="Sizes">
                {['JD', 'AB', 'MK', 'SL', 'CP'].map((initials, i) => (
                  <Avatar key={initials} className={['h-6 w-6', 'h-8 w-8', 'h-10 w-10', 'h-12 w-12', 'h-14 w-14'][i]}>
                    <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                  </Avatar>
                ))}
              </Row>
            </Section>

            {/* Tooltip */}
            <Section title="Tooltips">
              <Row label="Hover to reveal">
                <Tooltip content="Last traded price">
                  <Button variant="outline" size="sm">LTP <Info className="size-3" /></Button>
                </Tooltip>
                <Tooltip content="Best ask: $69,842.10">
                  <Button variant="sell" size="sm">Sell <Info className="size-3" /></Button>
                </Tooltip>
                <Tooltip content="Best bid: $69,812.00">
                  <Button variant="buy" size="sm">Buy <Info className="size-3" /></Button>
                </Tooltip>
              </Row>
            </Section>

            {/* Dialog */}
            <Section title="Dialog / Modal" description="Centered overlay for confirmations and forms">
              <Button onClick={() => setDialogOpen(true)}>Open Order Confirmation</Button>
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogContent className="w-96">
                  <DialogHeader onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Confirm Order</DialogTitle>
                    <DialogDescription>Review your order details before submitting.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 text-xs">
                    {[
                      ['Pair', 'BTC-USD'],
                      ['Side', 'Buy'],
                      ['Type', 'Limit'],
                      ['Price', '$69,820.00'],
                      ['Quantity', '0.0500 BTC'],
                      ['Total', '$3,491.00'],
                      ['Fee', '$0.00 (Maker)'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{k}</span>
                        <span className={cn('font-mono font-medium', k === 'Side' ? 'text-buy' : 'text-foreground')}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="buy" size="sm" onClick={() => setDialogOpen(false)}>
                      <CheckCircle className="size-3" />Place Buy Order
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Section>
          </TabsContent>

          {/* ── TRADING ── */}
          <TabsContent value="trading">
            {/* Order Entry */}
            <Section title="Order Entry Form" description="Buy / Sell panel with Limit, Market, Stop Limit tabs">
              <div className="w-72 rounded-xl border border-border bg-card overflow-hidden">
                {/* Buy/Sell header */}
                <div className="flex">
                  <button className="flex-1 py-2 text-xs font-semibold bg-buy-muted text-buy border-b-2 border-buy">Buy</button>
                  <button className="flex-1 py-2 text-xs font-semibold text-muted-foreground border-b border-border hover:text-sell transition-colors">Sell</button>
                </div>
                {/* Order type tabs */}
                <div className="px-3 pt-3">
                  <Tabs value={formTab} onValueChange={setFormTab}>
                    <TabsList className="border-0 gap-0">
                      <TabsTrigger value="limit" className="text-[11px] px-2 py-1">Limit</TabsTrigger>
                      <TabsTrigger value="market" className="text-[11px] px-2 py-1">Market</TabsTrigger>
                      <TabsTrigger value="stop" className="text-[11px] px-2 py-1">Stop Limit</TabsTrigger>
                    </TabsList>

                    <TabsContent value="limit" className="mt-3 space-y-2">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Limit Price (USD)</Label>
                        <Input defaultValue="69,820.00" className="h-7 text-xs font-mono" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Amount (BTC)</Label>
                        <Input defaultValue="0.0500" className="h-7 text-xs font-mono" />
                      </div>
                      <div className="flex gap-1 mt-1">
                        {['25%', '50%', '75%', 'Max'].map(p => (
                          <button key={p} className="flex-1 text-[10px] py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">{p}</button>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="market" className="mt-3 space-y-2">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Amount (USD)</Label>
                        <Input placeholder="0.00" className="h-7 text-xs font-mono" />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Order will execute at best available price.</p>
                    </TabsContent>

                    <TabsContent value="stop" className="mt-3 space-y-2">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Stop Price (USD)</Label>
                        <Input defaultValue="69,500.00" className="h-7 text-xs font-mono" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Limit Price (USD)</Label>
                        <Input defaultValue="69,480.00" className="h-7 text-xs font-mono" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="px-3 pb-3 mt-2 space-y-2">
                  <Separator />
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Order Total</span>
                    <span className="font-mono text-foreground">$3,491.00</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Fee (Maker)</span>
                    <span className="font-mono text-buy">$0.00</span>
                  </div>
                  <Button variant="buy" size="md" className="w-full rounded-full font-semibold">
                    Buy BTC
                  </Button>
                </div>
              </div>
            </Section>

            {/* Order Book */}
            <Section title="Order Book" description="Bid/ask depth with price-proportional fill bars and row tints">
              <div className="w-64 rounded-xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-3 px-3 py-1.5 border-b border-border text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  <span>Price (USD)</span>
                  <span className="text-right">Size (BTC)</span>
                  <span className="text-right">Total</span>
                </div>
                {/* Asks */}
                {ASKS.map((row) => (
                  <div key={row.price} className="relative grid grid-cols-3 px-3 py-0.5 text-[11px] font-mono hover:brightness-110" style={{ background: 'var(--sell-row)' }}>
                    <div className="absolute inset-y-0 right-0 bg-sell/10" style={{ width: `${Math.random() * 60 + 20}%` }} />
                    <span className="relative text-sell">{row.price}</span>
                    <span className="relative text-right text-foreground">{row.size}</span>
                    <span className="relative text-right text-muted-foreground">{row.total}</span>
                  </div>
                ))}
                {/* Spread */}
                <div className="px-3 py-1 bg-elevated flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Spread</span>
                  <span className="font-mono text-foreground">$30.10 · 0.04%</span>
                </div>
                {/* Bids */}
                {BIDS.map((row) => (
                  <div key={row.price} className="relative grid grid-cols-3 px-3 py-0.5 text-[11px] font-mono hover:brightness-110" style={{ background: 'var(--buy-row)' }}>
                    <div className="absolute inset-y-0 right-0 bg-buy/10" style={{ width: `${Math.random() * 60 + 20}%` }} />
                    <span className="relative text-buy">{row.price}</span>
                    <span className="relative text-right text-foreground">{row.size}</span>
                    <span className="relative text-right text-muted-foreground">{row.total}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Price ticker */}
            <Section title="Price Ticker" description="Top bar instrument summary">
              <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-2 w-fit">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pair</p>
                  <p className="text-xs font-semibold text-foreground">BTC-USDC</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Last Price</p>
                  <p className="text-xs font-mono font-semibold text-buy">$69,820.50</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">24h Change</p>
                  <p className="text-xs font-mono text-buy">+$1,615.32 (+2.36%)</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">24h Volume</p>
                  <p className="text-xs font-mono text-foreground">$1,116,015,443.93</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">24h High</p>
                  <p className="text-xs font-mono text-foreground">$70,684.02</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">24h Low</p>
                  <p className="text-xs font-mono text-foreground">$68,750.37</p>
                </div>
              </div>
            </Section>

            {/* Candle colors */}
            <Section title="Candlestick Colors" description="OHLC chart candle styling">
              <div className="flex items-end gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-0.5 h-4 bg-buy" />
                    <div className="w-4 h-8 rounded-sm bg-buy" />
                    <div className="w-0.5 h-3 bg-buy" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">Bullish</span>
                  <span className="text-[10px] font-mono text-buy">var(--buy)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-0.5 h-3 bg-sell" />
                    <div className="w-4 h-8 rounded-sm bg-sell" />
                    <div className="w-0.5 h-4 bg-sell" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">Bearish</span>
                  <span className="text-[10px] font-mono text-sell">var(--sell)</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-12 rounded" style={{ background: 'var(--buy-muted)' }} />
                    <span className="text-[10px] text-muted-foreground">buy-muted (volume bars)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-12 rounded" style={{ background: 'var(--sell-muted)' }} />
                    <span className="text-[10px] text-muted-foreground">sell-muted (volume bars)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-12 rounded" style={{ background: 'var(--buy-row)' }} />
                    <span className="text-[10px] text-muted-foreground">buy-row (order book tint)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-12 rounded" style={{ background: 'var(--sell-row)' }} />
                    <span className="text-[10px] text-muted-foreground">sell-row (order book tint)</span>
                  </div>
                </div>
              </div>
            </Section>
          </TabsContent>

          {/* ── PATTERNS ── */}
          <TabsContent value="patterns">
            {/* Positions table */}
            <Section title="Positions Table" description="Open positions with P&L — uses Table, Badge, and typography tokens">
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Symbol</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Entry Price</TableHead>
                      <TableHead className="text-right">Mark Price</TableHead>
                      <TableHead className="text-right">Unrealised P&L</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {POSITIONS.map(p => (
                      <TableRow key={p.symbol}>
                        <TableCell className="font-medium">{p.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={p.side === 'Long' ? 'buy' : 'sell'}>{p.side}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">{p.qty}</TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">${p.entry}</TableCell>
                        <TableCell className="text-right font-mono">${p.mark}</TableCell>
                        <TableCell className={cn('text-right font-mono font-medium', p.positive ? 'text-buy' : 'text-sell')}>
                          {p.pnl} <span className="text-[10px]">({p.pnlPct})</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="xs" variant="outline">Edit</Button>
                            <Button size="xs" variant="sell">Close</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Section>

            {/* Onboarding step flow */}
            <Section title="Step Progress" description="Multi-step onboarding / KYC flow">
              <div className="max-w-sm space-y-3">
                {[
                  { label: 'Create account', done: true },
                  { label: 'Verify identity', done: true },
                  { label: 'Fund account', done: true },
                  { label: 'Buy your first crypto', done: false, active: true },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                      step.done ? 'bg-buy text-buy-foreground' :
                      step.active ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {step.done ? <CheckCircle className="size-3" /> : i + 1}
                    </div>
                    <span className={cn('text-xs', step.done || step.active ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                      {step.label}
                    </span>
                    {step.active && <ChevronRight className="size-3 text-primary ml-auto" />}
                  </div>
                ))}
              </div>
            </Section>

            {/* Asset list row */}
            <Section title="Asset List Row" description="Standard market row with icon, name, price, change, and action">
              <div className="max-w-lg space-y-0 rounded-xl border border-border overflow-hidden">
                {[
                  { name: 'Bitcoin',  ticker: 'BTC', price: '$69,820.50', change: '+2.34%', positive: true  },
                  { name: 'Ethereum', ticker: 'ETH', price: '$3,498.20',  change: '+0.91%', positive: true  },
                  { name: 'Solana',   ticker: 'SOL', price: '$191.35',    change: '−3.65%', positive: false },
                  { name: 'USDC',     ticker: 'USDC', price: '$1.00',    change: '0.00%',  positive: true  },
                ].map((asset, i, arr) => (
                  <div key={asset.ticker} className={cn('flex items-center px-4 py-2.5 hover:bg-muted/50 transition-colors', i < arr.length - 1 && 'border-b border-border')}>
                    <Avatar className="h-7 w-7 mr-3">
                      <AvatarFallback className="text-[9px] font-bold">{asset.ticker.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{asset.name}</p>
                      <p className="text-[11px] text-muted-foreground">{asset.ticker}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-xs font-mono text-foreground">{asset.price}</p>
                      <p className={cn('text-[11px] font-mono', asset.positive ? 'text-buy' : 'text-sell')}>{asset.change}</p>
                    </div>
                    <Button size="xs" variant="outline">Buy</Button>
                  </div>
                ))}
              </div>
            </Section>

            {/* Toast notification */}
            <Section title="Toast / Notifications" description="In-app feedback toasts (non-interactive preview)">
              <div className="space-y-2 max-w-xs">
                {[
                  { variant: 'success' as const, title: 'Order submitted', msg: 'Buy 0.05 BTC at $69,820' },
                  { variant: 'info' as const,    title: 'Price alert',     msg: 'BTC reached $70,000' },
                  { variant: 'warning' as const, title: 'High slippage',   msg: 'Market impact may exceed 0.5%' },
                  { variant: 'destructive' as const, title: 'Order failed', msg: 'Insufficient balance' },
                ].map(({ variant, title, msg }) => (
                  <div key={title} className={cn(
                    'flex items-start gap-3 rounded-xl border px-3 py-2.5 shadow-lg',
                    {
                      success:     'bg-buy-muted border-buy/20',
                      info:        'bg-primary/10 border-primary/20',
                      warning:     'bg-warning/10 border-warning/20',
                      destructive: 'bg-sell-muted border-sell/20',
                    }[variant]
                  )}>
                    <div className={cn('mt-0.5', {
                      success: 'text-buy', info: 'text-primary', warning: 'text-warning', destructive: 'text-sell'
                    }[variant])}>
                      {{ success: <CheckCircle className="size-3.5" />, info: <Info className="size-3.5" />, warning: <AlertTriangle className="size-3.5" />, destructive: <XCircle className="size-3.5" /> }[variant]}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">{title}</p>
                      <p className="text-[11px] text-muted-foreground">{msg}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground"><X className="size-3" /></button>
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// needed for toast close button
function X({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  )
}
