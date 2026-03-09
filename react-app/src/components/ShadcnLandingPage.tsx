import React, { useState } from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import {
  Github, Moon, Sun, Search, ArrowRight, Check, TrendingUp,
  Bell, ChevronRight, Copy, Terminal, Palette,
  Layers, Zap, Code2, CheckCircle, AlertTriangle, Info, XCircle,
  ArrowUpRight,
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
import { Tooltip } from '@/components/ui/tooltip'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Accordion } from '@/components/ui/accordion'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Calendar } from '@/components/ui/calendar'
import { Carousel } from '@/components/ui/carousel'
import { Collapsible } from '@/components/ui/collapsible'
import { Command } from '@/components/ui/command'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut } from '@/components/ui/dropdown-menu'
import { HoverCard } from '@/components/ui/hover-card'
import { InputOTP } from '@/components/ui/input-otp'
import { Kbd } from '@/components/ui/kbd'
import { Pagination } from '@/components/ui/pagination'
import { Popover } from '@/components/ui/popover'
import { PopoverContent } from '@/components/ui/popover'
import { RadioGroupWrapper } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Menubar } from '@/components/ui/menubar'
import { MenubarItem, MenubarSeparator, MenubarShortcut } from '@/components/ui/menubar'
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker'
import { useTheme } from '@/components/theme/ThemeProvider'
import { cn } from '@/lib/utils'

/* ─── Price chart data ─────────────────────────────────────── */
const chartData = [
  65200, 66100, 65800, 67300, 68100, 67600, 69200, 70100, 69400,
  68800, 69820, 70500, 69900, 70800, 71200, 70400, 69600, 70200,
  71000, 70600, 69800, 70900, 71500, 70700, 71800, 72100, 71400,
  72500, 71900, 72800,
].map((p, i) => ({ i, price: p + (Math.random() - 0.5) * 400 }))

/* ─── Syntax-highlighted code block ──────────────────────────── */
function CodeBlock({ code, lang = 'tsx' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlight = (line: string) => {
    // keyword coloring via simple token pass
    const parts: { text: string; cls: string }[] = []
    let rest = line

    const push = (text: string, cls = '') => {
      if (text) parts.push({ text, cls })
    }

    // Process line character by character (simplified tokenizer)
    const tokens = rest.split(/(\bimport\b|\bfrom\b|\bexport\b|\bconst\b|\bfunction\b|\breturn\b|\bdefault\b|\bnull\b|\bundefined\b|"[^"]*"|'[^']*'|`[^`]*`|\/\/.*$|<\/?[A-Z][A-Za-z]*|<\/?[a-z]+(?=[^a-zA-Z])|\/?>|\{|\})/g)

    for (const tok of tokens) {
      if (!tok) continue
      if (/^(import|from|export|const|function|return|default|null|undefined)$/.test(tok)) {
        push(tok, 'text-primary')
      } else if (/^["'`]/.test(tok)) {
        push(tok, 'text-buy')
      } else if (/^\/\//.test(tok)) {
        push(tok, 'text-muted-foreground/60 italic')
      } else if (/^<\/?[A-Z]/.test(tok)) {
        push(tok, 'text-sell')
      } else if (/^<\/?[a-z]/.test(tok)) {
        push(tok, 'text-primary/80')
      } else {
        push(tok)
      }
    }

    return parts
  }

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border bg-[#0c0e12]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <span className="text-[11px] text-muted-foreground font-mono">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <><Check className="size-3 text-buy" /> Copied</> : <><Copy className="size-3" /> Copy</>}
        </button>
      </div>
      <pre className="p-4 text-[12px] font-mono leading-6 overflow-x-auto text-[#e2e8f0]">
        {code.split('\n').map((line, i) => (
          <div key={i}>
            {highlight(line).map((tok, j) => (
              <span key={j} className={tok.cls}>{tok.text}</span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  )
}

/* ─── Component code examples ────────────────────────────────── */
const COMPONENTS: Record<string, { description: string; code: string; preview: () => React.ReactElement }> = {
  Button: {
    description: 'Displays a button or a component that looks like a button.',
    code: `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="buy">Buy</Button>
      <Button variant="sell">Sell</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}`,
    preview: () => (
      <div className="flex flex-wrap gap-2 p-6">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="buy">Buy BTC</Button>
        <Button variant="sell">Sell BTC</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    ),
  },
  Badge: {
    description: 'Displays a badge or a component that looks like a badge.',
    code: `import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="buy">+2.34%</Badge>
      <Badge variant="sell">-1.87%</Badge>
      <Badge variant="warning">Margin Call</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}`,
    preview: () => (
      <div className="flex flex-wrap gap-2 p-6">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="buy">+2.34%</Badge>
        <Badge variant="sell">−1.87%</Badge>
        <Badge variant="warning">Margin Call</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="muted">Closed</Badge>
      </div>
    ),
  },
  Card: {
    description: 'Displays a card with header, content, and footer.',
    code: `import { Card, CardHeader, CardTitle,
  CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CardDemo() {
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>BTC-USD</CardTitle>
        <CardDescription>Bitcoin · Perpetual</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold font-mono">
          $69,820.50
        </p>
        <p className="text-xs text-buy mt-1">+2.34% today</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="buy" className="flex-1">Buy</Button>
        <Button variant="sell" className="flex-1">Sell</Button>
      </CardFooter>
    </Card>
  )
}`,
    preview: () => (
      <div className="p-6 flex justify-center">
        <Card className="w-72">
          <CardHeader>
            <CardTitle>BTC-USD</CardTitle>
            <CardDescription>Bitcoin · Perpetual</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono text-foreground">$69,820.50</p>
            <p className="text-xs text-buy mt-1 flex items-center gap-1"><ArrowUpRight className="size-3" />+2.34% today</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="buy" className="flex-1">Buy</Button>
            <Button variant="sell" className="flex-1">Sell</Button>
          </CardFooter>
        </Card>
      </div>
    ),
  },
  Input: {
    description: 'Displays a form input field or a component that looks like an input field.',
    code: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputDemo() {
  return (
    <div className="space-y-4 w-72">
      <div className="space-y-1.5">
        <Label htmlFor="price">Limit Price (USD)</Label>
        <Input id="price" defaultValue="69,820.00" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount (BTC)</Label>
        <Input id="amount" placeholder="0.0000" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="err">Insufficient balance</Label>
        <Input id="err" error defaultValue="999999" />
        <p className="text-xs text-destructive">
          Exceeds available balance
        </p>
      </div>
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 flex justify-center">
        <div className="space-y-4 w-72">
          <div className="space-y-1.5">
            <Label htmlFor="prev-price">Limit Price (USD)</Label>
            <Input id="prev-price" defaultValue="69,820.00" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prev-amount">Amount (BTC)</Label>
            <Input id="prev-amount" placeholder="0.0000" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prev-err">Insufficient balance</Label>
            <Input id="prev-err" error defaultValue="999999" />
            <p className="text-xs text-destructive">Exceeds available balance</p>
          </div>
        </div>
      </div>
    ),
  },
  Tabs: {
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    code: `import { Tabs, TabsList, TabsTrigger,
  TabsContent } from "@/components/ui/tabs"

export function TabsDemo() {
  return (
    <Tabs defaultValue="limit">
      <TabsList>
        <TabsTrigger value="limit">Limit</TabsTrigger>
        <TabsTrigger value="market">Market</TabsTrigger>
        <TabsTrigger value="stop">Stop Limit</TabsTrigger>
      </TabsList>
      <TabsContent value="limit">
        Limit order form
      </TabsContent>
      <TabsContent value="market">
        Market order form
      </TabsContent>
      <TabsContent value="stop">
        Stop limit form
      </TabsContent>
    </Tabs>
  )
}`,
    preview: () => {
      const [t, setT] = useState('limit')
      return (
        <div className="p-6">
          <Tabs value={t} onValueChange={setT}>
            <TabsList>
              <TabsTrigger value="limit">Limit</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="stop">Stop Limit</TabsTrigger>
            </TabsList>
            <TabsContent value="limit">
              <div className="mt-3 space-y-2">
                <Label>Limit Price (USD)</Label>
                <Input defaultValue="69,820.00" className="max-w-xs" />
              </div>
            </TabsContent>
            <TabsContent value="market">
              <p className="mt-3 text-xs text-muted-foreground">Executes immediately at best available price.</p>
            </TabsContent>
            <TabsContent value="stop">
              <div className="mt-3 space-y-2">
                <Label>Stop Price (USD)</Label>
                <Input defaultValue="69,500.00" className="max-w-xs" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )
    },
  },
  Alert: {
    description: 'Displays a callout for user attention with info, success, warning, and error variants.',
    code: `import { Alert, AlertTitle,
  AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export function AlertDemo() {
  return (
    <div className="space-y-2 w-full max-w-md">
      <Alert variant="success">
        <CheckCircle className="size-3.5" />
        <AlertTitle>Order filled</AlertTitle>
        <AlertDescription>
          Bought 0.05 BTC at $69,820.00
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTriangle className="size-3.5" />
        <AlertTitle>Margin warning</AlertTitle>
        <AlertDescription>
          Margin ratio at 85%. Add collateral.
        </AlertDescription>
      </Alert>
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 space-y-2 max-w-md">
        <Alert variant="info"><Info className="size-3.5" /><AlertTitle>Fees reduced</AlertTitle><AlertDescription>Your maker fee is now 0.00% with Advanced.</AlertDescription></Alert>
        <Alert variant="success"><CheckCircle className="size-3.5" /><AlertTitle>Order filled</AlertTitle><AlertDescription>Bought 0.05 BTC at $69,820.00</AlertDescription></Alert>
        <Alert variant="warning"><AlertTriangle className="size-3.5" /><AlertTitle>Margin warning</AlertTitle><AlertDescription>Margin ratio at 85%. Add collateral.</AlertDescription></Alert>
        <Alert variant="destructive"><XCircle className="size-3.5" /><AlertTitle>Liquidation risk</AlertTitle><AlertDescription>Position will be liquidated at $67,400.00</AlertDescription></Alert>
      </div>
    ),
  },
  Switch: {
    description: 'A control that allows the user to toggle between checked and not checked.',
    code: `import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function SwitchDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch defaultChecked />
        <Label>Advanced trading</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch />
        <Label>Price notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked />
        <Label>Dark mode</Label>
      </div>
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2"><Switch defaultChecked /><Label>Advanced trading</Label></div>
        <div className="flex items-center gap-2"><Switch /><Label>Price notifications</Label></div>
        <div className="flex items-center gap-2"><Switch defaultChecked /><Label>Dark mode</Label></div>
        <div className="flex items-center gap-2"><Switch disabled /><Label className="text-muted-foreground">Disabled</Label></div>
      </div>
    ),
  },
  Progress: {
    description: 'Displays an indicator showing the completion progress of a task.',
    code: `import { Progress } from "@/components/ui/progress"

export function ProgressDemo() {
  return (
    <div className="space-y-3 w-72">
      <Progress value={68} />
      <Progress value={72} variant="buy" />
      <Progress value={28} variant="sell" />
      <Progress value={85} variant="warning" />
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 space-y-4 max-w-sm">
        {[
          { label: 'Order fill', v: 68, variant: 'default' as const },
          { label: 'Portfolio gains', v: 72, variant: 'buy' as const },
          { label: 'Drawdown', v: 28, variant: 'sell' as const },
          { label: 'Margin used', v: 85, variant: 'warning' as const },
        ].map(({ label, v, variant }) => (
          <div key={label} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground font-mono">{v}%</span>
            </div>
            <Progress value={v} variant={variant} />
          </div>
        ))}
      </div>
    ),
  },
  Table: {
    description: 'A responsive table component for displaying structured data.',
    code: `import { Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead className="text-right">P&L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>BTC-USD</TableCell>
          <TableCell><Badge variant="buy">Long</Badge></TableCell>
          <TableCell className="text-right text-buy">
            +$810.00
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
    preview: () => (
      <div className="p-6">
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { s: 'BTC-USD', side: 'Long',  entry: '$68,200', pnl: '+$810.00', pos: true },
                { s: 'ETH-USD', side: 'Short', entry: '$3,550',  pnl: '+$110.00', pos: true },
                { s: 'SOL-USD', side: 'Long',  entry: '$198.50', pnl: '−$72.50',  pos: false },
              ].map(r => (
                <TableRow key={r.s}>
                  <TableCell className="font-medium">{r.s}</TableCell>
                  <TableCell><Badge variant={r.side === 'Long' ? 'buy' : 'sell'}>{r.side}</Badge></TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{r.entry}</TableCell>
                  <TableCell className={cn('text-right font-mono font-medium', r.pos ? 'text-buy' : 'text-sell')}>{r.pnl}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  Skeleton: {
    description: 'Use to show a placeholder while content is loading.',
    code: `import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 space-y-4 max-w-sm">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-2.5 w-1/3" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        ))}
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    ),
  },
  Avatar: {
    description: 'An image element with a fallback for representing the user.',
    code: `import { Avatar, AvatarFallback,
  AvatarImage } from "@/components/ui/avatar"

export function AvatarDemo() {
  return (
    <div className="flex gap-3 items-center">
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="h-10 w-10">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarFallback>MK</AvatarFallback>
      </Avatar>
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 flex items-center gap-4">
        {['JD', 'AB', 'MK', 'SL', 'CP'].map((initials, i) => (
          <div key={initials} className="flex flex-col items-center gap-1.5">
            <Avatar className={['h-6 w-6', 'h-8 w-8', 'h-10 w-10', 'h-12 w-12', 'h-14 w-14'][i]}>
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground">{[24, 32, 40, 48, 56][i]}px</span>
          </div>
        ))}
      </div>
    ),
  },
  Separator: {
    description: 'Visually or semantically separates content.',
    code: `import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div className="space-y-4 max-w-xs">
      <div>
        <p className="text-sm font-medium">MarketsUI</p>
        <p className="text-xs text-muted-foreground">
          Trading design system
        </p>
      </div>
      <Separator />
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>Docs</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Components</span>
        <Separator orientation="vertical" className="h-4" />
        <span>GitHub</span>
      </div>
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 space-y-4 max-w-xs">
        <div>
          <p className="text-sm font-medium">MarketsUI</p>
          <p className="text-xs text-muted-foreground">Trading design system</p>
        </div>
        <Separator />
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Docs</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Components</span>
          <Separator orientation="vertical" className="h-4" />
          <span>GitHub</span>
        </div>
      </div>
    ),
  },
  Tooltip: {
    description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    code: `import { Tooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function TooltipDemo() {
  return (
    <div className="flex gap-4">
      <Tooltip content="Best bid price">
        <Button variant="buy">Buy</Button>
      </Tooltip>
      <Tooltip content="Best ask price">
        <Button variant="sell">Sell</Button>
      </Tooltip>
      <Tooltip content="Last traded price">
        <Button variant="outline">LTP</Button>
      </Tooltip>
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 flex gap-4 justify-center">
        <Tooltip content="Best bid: $69,812.00"><Button variant="buy">Buy</Button></Tooltip>
        <Tooltip content="Best ask: $69,842.10"><Button variant="sell">Sell</Button></Tooltip>
        <Tooltip content="Last traded price"><Button variant="outline">LTP</Button></Tooltip>
        <Tooltip content="Mark price: $69,827.05"><Button variant="secondary">Mark</Button></Tooltip>
      </div>
    ),
  },
  Checkbox: {
    description: 'A control that allows the user to toggle between checked and not checked.',
    code: `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" defaultChecked />
        <Label htmlFor="terms">
          I agree to the terms
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="post-only" />
        <Label htmlFor="post-only">Post only</Label>
      </div>
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2"><Checkbox defaultChecked /><Label>I agree to the trading terms</Label></div>
        <div className="flex items-center gap-2"><Checkbox /><Label>Post only order</Label></div>
        <div className="flex items-center gap-2"><Checkbox defaultChecked /><Label>Reduce only</Label></div>
        <div className="flex items-center gap-2"><Checkbox disabled /><Label className="text-muted-foreground">Disabled option</Label></div>
      </div>
    ),
  },
  Select: {
    description: 'Displays a list of options for the user to pick from—triggered by a button.',
    code: `import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function SelectDemo() {
  return (
    <div className="space-y-1.5 w-56">
      <Label>Trading Pair</Label>
      <Select defaultValue="btcusd">
        <option value="btcusd">BTC-USD</option>
        <option value="ethusd">ETH-USD</option>
        <option value="solusd">SOL-USD</option>
      </Select>
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 space-y-4">
        <div className="space-y-1.5 w-56">
          <Label>Trading Pair</Label>
          <Select defaultValue="btcusd">
            <option value="btcusd">BTC-USD</option>
            <option value="ethusd">ETH-USD</option>
            <option value="solusd">SOL-USD</option>
          </Select>
        </div>
        <div className="space-y-1.5 w-56">
          <Label>Order Type</Label>
          <Select defaultValue="limit">
            <option value="limit">Limit</option>
            <option value="market">Market</option>
            <option value="stop">Stop Limit</option>
          </Select>
        </div>
        <div className="space-y-1.5 w-56">
          <Label>Time in Force</Label>
          <Select defaultValue="gtc">
            <option value="gtc">Good 'til Cancelled</option>
            <option value="ioc">Immediate or Cancel</option>
            <option value="fok">Fill or Kill</option>
          </Select>
        </div>
      </div>
    ),
  },
  Textarea: {
    description: 'Displays a form textarea or a component that looks like a textarea.',
    code: `import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function TextareaDemo() {
  return (
    <div className="space-y-1.5 w-72">
      <Label htmlFor="note">Trade note</Label>
      <Textarea
        id="note"
        placeholder="Add a note to this trade..."
      />
    </div>
  )
}`,
    preview: () => (
      <div className="p-6 space-y-4">
        <div className="space-y-1.5 w-72">
          <Label>Trade note</Label>
          <Textarea placeholder="Add a note to this trade..." />
        </div>
        <div className="space-y-1.5 w-72">
          <Label>API Webhook URL</Label>
          <Textarea placeholder="https://your-server.com/webhook" defaultValue="https://my-alerts.io/webhook/btc-price" />
        </div>
      </div>
    ),
  },
  Dialog: {
    description: 'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
    code: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
            <DialogDescription>Review your order before placing it.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Buy 0.05 BTC at $69,820.00</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="buy" onClick={() => setOpen(false)}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}`,
    preview: () => {
      const [open, setOpen] = useState(false)
      return (
        <div className="flex items-center justify-center p-6">
          <Button onClick={() => setOpen(true)}>Open Dialog</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Order</DialogTitle>
                <DialogDescription>Review your order details before placing it.</DialogDescription>
              </DialogHeader>
              <div className="space-y-1.5 text-sm">
                {[['Pair','BTC-USD'],['Side','Buy'],['Amount','0.05 BTC'],['Price','$69,820.00'],['Total','$3,491.00']].map(([k,v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-mono font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="buy" onClick={() => setOpen(false)}>Place Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
  Accordion: {
    description: 'A vertically stacked set of interactive headings that each reveal an associated section of content.',
    code: `import { Accordion } from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion items={[
      { value: "fees", trigger: "What are the trading fees?", content: "Our fee structure is 0.00% maker and 0.05% taker for standard accounts." },
      { value: "margin", trigger: "How does margin trading work?", content: "Margin trading allows you to trade with leverage up to 10x your collateral." },
      { value: "withdraw", trigger: "How do I withdraw funds?", content: "Navigate to the Wallet section and click Withdraw. Minimum withdrawal is $10." },
    ]} />
  )
}`,
    preview: () => (
      <div className="p-6 w-full max-w-md mx-auto">
        <Accordion items={[
          { value: 'fees', trigger: 'What are the trading fees?', content: 'Our fee structure is 0.00% maker and 0.05% taker for standard accounts. VIP tiers offer further discounts.' },
          { value: 'margin', trigger: 'How does margin trading work?', content: 'Margin trading allows you to trade with leverage up to 10x your collateral. Liquidation triggers at 80% margin usage.' },
          { value: 'withdraw', trigger: 'How do I withdraw funds?', content: 'Navigate to the Wallet section and click Withdraw. Processing takes 1–2 business days. Minimum withdrawal is $10.' },
        ]} />
      </div>
    ),
  },
  AlertDialog: {
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    code: `import { AlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Cancel Order</Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel Order?"
        description="This will immediately cancel your open BTC-USD limit order at $69,820.00. This action cannot be undone."
        confirmLabel="Yes, cancel order"
        cancelLabel="Keep order"
        variant="destructive"
        onConfirm={() => console.log('cancelled')}
      />
    </>
  )
}`,
    preview: () => {
      const [open, setOpen] = useState(false)
      return (
        <div className="flex items-center justify-center p-6">
          <Button variant="destructive" onClick={() => setOpen(true)}>Cancel Order</Button>
          <AlertDialog
            open={open}
            onOpenChange={setOpen}
            title="Cancel Order?"
            description="This will immediately cancel your open BTC-USD limit order at $69,820.00. This action cannot be undone."
            confirmLabel="Yes, cancel order"
            cancelLabel="Keep order"
            variant="destructive"
            onConfirm={() => {}}
          />
        </div>
      )
    },
  },
  Breadcrumb: {
    description: 'Displays the path to the current resource using a hierarchy of links.',
    code: `import { Breadcrumb } from "@/components/ui/breadcrumb"

export function BreadcrumbDemo() {
  return (
    <Breadcrumb items={[
      { label: "Home", href: "/" },
      { label: "Components" },
      { label: "Breadcrumb" },
    ]} />
  )
}`,
    preview: () => (
      <div className="p-6">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '#' },
          { label: 'Components', href: '#' },
          { label: 'Breadcrumb' },
        ]} />
      </div>
    ),
  },
  Calendar: {
    description: 'A date field component that allows users to enter and edit date.',
    code: `import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

export function CalendarDemo() {
  const [date, setDate] = useState<Date>()
  return <Calendar selected={date} onSelect={setDate} />
}`,
    preview: () => {
      const [date, setDate] = useState<Date | undefined>(new Date())
      return (
        <div className="flex items-center justify-center p-6">
          <Calendar selected={date} onSelect={setDate} />
        </div>
      )
    },
  },
  Carousel: {
    description: 'A carousel with motion and swipe built using Embla.',
    code: `import { Carousel, CarouselItem } from "@/components/ui/carousel"

export function CarouselDemo() {
  return (
    <Carousel items={[
      <CarouselItem key="1"><div className="h-40 bg-card rounded-lg flex items-center justify-center font-mono">BTC-USD $72,814</div></CarouselItem>,
      <CarouselItem key="2"><div className="h-40 bg-card rounded-lg flex items-center justify-center font-mono">ETH-USD $3,498</div></CarouselItem>,
      <CarouselItem key="3"><div className="h-40 bg-card rounded-lg flex items-center justify-center font-mono">SOL-USD $191.40</div></CarouselItem>,
    ]} />
  )
}`,
    preview: () => (
      <div className="p-6 w-full">
        <Carousel items={[
          <div key="1" className="h-40 bg-card rounded-lg border border-border flex flex-col items-center justify-center gap-1 font-mono">
            <span className="text-xs text-muted-foreground">BTC-USD</span>
            <span className="text-2xl font-bold">$72,814</span>
            <span className="text-xs text-buy">+2.36%</span>
          </div>,
          <div key="2" className="h-40 bg-card rounded-lg border border-border flex flex-col items-center justify-center gap-1 font-mono">
            <span className="text-xs text-muted-foreground">ETH-USD</span>
            <span className="text-2xl font-bold">$3,498</span>
            <span className="text-xs text-buy">+1.12%</span>
          </div>,
          <div key="3" className="h-40 bg-card rounded-lg border border-border flex flex-col items-center justify-center gap-1 font-mono">
            <span className="text-xs text-muted-foreground">SOL-USD</span>
            <span className="text-2xl font-bold">$191.40</span>
            <span className="text-xs text-sell">−0.87%</span>
          </div>,
        ]} />
      </div>
    ),
  },
  Collapsible: {
    description: 'An interactive component which expands/collapses a panel.',
    code: `import { Collapsible } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function CollapsibleDemo() {
  return (
    <Collapsible trigger={
      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-2">
        <span className="text-sm font-medium">Order History (3)</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    }>
      <p className="text-sm text-muted-foreground p-2">Filled: BTC-USD Buy 0.05 @ $69,820</p>
    </Collapsible>
  )
}`,
    preview: () => (
      <div className="p-6 w-full max-w-sm mx-auto">
        <Collapsible
          trigger={
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-2 hover:bg-accent transition-colors">
              <span className="text-sm font-medium">Order History (3)</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          }
        >
          <div className="mt-2 space-y-1 rounded-lg border border-border overflow-hidden">
            {[
              { pair: 'BTC-USD', side: 'Buy', price: '$69,820', status: 'Filled' },
              { pair: 'ETH-USD', side: 'Sell', price: '$3,512', status: 'Filled' },
              { pair: 'SOL-USD', side: 'Buy', price: '$188.40', status: 'Cancelled' },
            ].map((o, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 text-xs border-b border-border last:border-0">
                <span className="font-medium">{o.pair}</span>
                <span className={o.side === 'Buy' ? 'text-buy' : 'text-sell'}>{o.side}</span>
                <span className="font-mono text-muted-foreground">{o.price}</span>
                <Badge variant={o.status === 'Filled' ? 'buy' : 'muted'} className="text-[10px] py-0">{o.status}</Badge>
              </div>
            ))}
          </div>
        </Collapsible>
      </div>
    ),
  },
  Command: {
    description: 'Fast, composable, unstyled command menu for React.',
    code: `import { Command } from "@/components/ui/command"

export function CommandDemo() {
  return (
    <Command
      placeholder="Search markets, actions..."
      items={[
        { value: "btc", label: "BTC-USD · Bitcoin", group: "Markets" },
        { value: "eth", label: "ETH-USD · Ethereum", group: "Markets" },
        { value: "buy", label: "Place Buy Order", group: "Actions" },
      ]}
    />
  )
}`,
    preview: () => (
      <div className="p-6 w-full max-w-sm mx-auto">
        <Command
          placeholder="Search markets, actions..."
          items={[
            { value: 'btc', label: 'BTC-USD · Bitcoin', group: 'Markets' },
            { value: 'eth', label: 'ETH-USD · Ethereum', group: 'Markets' },
            { value: 'sol', label: 'SOL-USD · Solana', group: 'Markets' },
            { value: 'buy', label: 'Place Buy Order', group: 'Actions' },
            { value: 'sell', label: 'Place Sell Order', group: 'Actions' },
            { value: 'history', label: 'View Order History', group: 'Actions' },
          ]}
        />
      </div>
    ),
  },
  DropdownMenu: {
    description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
    code: `import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function DropdownMenuDemo() {
  return (
    <DropdownMenu trigger={<Button variant="outline">Actions ▾</Button>}>
      <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>View Details</DropdownMenuItem>
      <DropdownMenuItem>Modify Order</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-sell">Cancel Order</DropdownMenuItem>
    </DropdownMenu>
  )
}`,
    preview: () => (
      <div className="flex items-center justify-center p-6 min-h-[200px]">
        <DropdownMenu trigger={<Button variant="outline" size="sm">Order Actions ▾</Button>}>
          <DropdownMenuLabel>Order #4821</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View Details <DropdownMenuShortcut>⌘V</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem>Modify Order <DropdownMenuShortcut>⌘M</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-sell">Cancel Order <DropdownMenuShortcut>⌫</DropdownMenuShortcut></DropdownMenuItem>
        </DropdownMenu>
      </div>
    ),
  },
  HoverCard: {
    description: 'For sighted users to preview content available behind a link.',
    code: `import { HoverCard } from "@/components/ui/hover-card"

export function HoverCardDemo() {
  return (
    <HoverCard trigger={<span className="underline cursor-pointer">BTC-USD</span>}>
      <div>
        <p className="font-semibold text-sm">Bitcoin · BTC</p>
        <p className="text-xs text-muted-foreground">Market Cap: $1.4T · 24h Vol: $28B</p>
      </div>
    </HoverCard>
  )
}`,
    preview: () => (
      <div className="flex items-center justify-center p-6 min-h-[120px]">
        <HoverCard
          trigger={
            <span className="text-primary underline decoration-dotted cursor-pointer text-sm font-medium">BTC-USD</span>
          }
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">₿</div>
              <div>
                <p className="font-semibold text-sm">Bitcoin · BTC</p>
                <p className="text-xs text-muted-foreground">Rank #1</p>
              </div>
            </div>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between gap-4"><span>Price</span><span className="font-mono text-foreground">$72,814</span></div>
              <div className="flex justify-between gap-4"><span>24h Change</span><span className="text-buy">+2.36%</span></div>
              <div className="flex justify-between gap-4"><span>Market Cap</span><span className="font-mono text-foreground">$1.43T</span></div>
            </div>
          </div>
        </HoverCard>
      </div>
    ),
  },
  InputOTP: {
    description: 'Accessible one-time password component with copy paste functionality.',
    code: `import { InputOTP } from "@/components/ui/input-otp"
import { useState } from "react"

export function InputOTPDemo() {
  const [value, setValue] = useState("")
  return (
    <div className="space-y-3">
      <InputOTP length={6} value={value} onChange={setValue} />
      <p className="text-sm text-muted-foreground">
        {value.length === 6 ? "Code entered: " + value : "Enter your 6-digit code"}
      </p>
    </div>
  )
}`,
    preview: () => {
      const [otp, setOtp] = useState('')
      return (
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="text-center">
            <p className="text-sm font-medium mb-1">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
          </div>
          <InputOTP length={6} value={otp} onChange={setOtp} />
          {otp.length === 6 && <Badge variant="buy">Code verified ✓</Badge>}
        </div>
      )
    },
  },
  Kbd: {
    description: 'Keyboard key representation used in documentation and tooltips.',
    code: `import { Kbd } from "@/components/ui/kbd"

export function KbdDemo() {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd><span className="text-sm ml-1">Search</span></div>
      <div className="flex items-center gap-1"><Kbd>⌘</Kbd><Kbd>B</Kbd><span className="text-sm ml-1">Buy</span></div>
      <div className="flex items-center gap-1"><Kbd>Esc</Kbd><span className="text-sm ml-1">Cancel</span></div>
    </div>
  )
}`,
    preview: () => (
      <div className="flex flex-col gap-3 p-6">
        {[
          { keys: ['⌘', 'K'], label: 'Open command palette' },
          { keys: ['⌘', 'B'], label: 'Place buy order' },
          { keys: ['⌘', 'S'], label: 'Place sell order' },
          { keys: ['Esc'], label: 'Cancel / close' },
          { keys: ['⌘', 'Z'], label: 'Undo last action' },
        ].map(({ keys, label }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-1">{keys.map(k => <Kbd key={k}>{k}</Kbd>)}</div>
          </div>
        ))}
      </div>
    ),
  },
  Menubar: {
    description: 'A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.',
    code: `import { Menubar } from "@/components/ui/menubar"
import { MenubarItem, MenubarSeparator, MenubarShortcut } from "@/components/ui/menubar"

export function MenubarDemo() {
  return (
    <Menubar menus={[
      { label: "File", children: <><MenubarItem>New Order <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem><MenubarSeparator /><MenubarItem>Export CSV</MenubarItem></> },
      { label: "View", children: <><MenubarItem>Chart</MenubarItem><MenubarItem>Order Book</MenubarItem></> },
    ]} />
  )
}`,
    preview: () => (
      <div className="flex items-start justify-center p-6">
        <Menubar menus={[
          {
            label: 'File',
            children: (
              <>
                <MenubarItem>New Order <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                <MenubarItem>New Alert <MenubarShortcut>⌘⇧A</MenubarShortcut></MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Export CSV</MenubarItem>
                <MenubarItem>Print Report</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Preferences</MenubarItem>
              </>
            ),
          },
          {
            label: 'View',
            children: (
              <>
                <MenubarItem>Chart <MenubarShortcut>⌘1</MenubarShortcut></MenubarItem>
                <MenubarItem>Order Book <MenubarShortcut>⌘2</MenubarShortcut></MenubarItem>
                <MenubarItem>Trade History <MenubarShortcut>⌘3</MenubarShortcut></MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Dark Mode</MenubarItem>
              </>
            ),
          },
          {
            label: 'Help',
            children: (
              <>
                <MenubarItem>Documentation</MenubarItem>
                <MenubarItem>Keyboard Shortcuts</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>About MarketsUI</MenubarItem>
              </>
            ),
          },
        ]} />
      </div>
    ),
  },
  Pagination: {
    description: 'Pagination with page navigation, next and previous links.',
    code: `import { Pagination } from "@/components/ui/pagination"
import { useState } from "react"

export function PaginationDemo() {
  const [page, setPage] = useState(1)
  return <Pagination page={page} totalPages={10} onPageChange={setPage} />
}`,
    preview: () => {
      const [page, setPage] = useState(3)
      return (
        <div className="flex flex-col items-center gap-4 p-6">
          <p className="text-sm text-muted-foreground">Page {page} of 10 · Showing orders {(page-1)*10+1}–{page*10}</p>
          <Pagination page={page} totalPages={10} onPageChange={setPage} />
        </div>
      )
    },
  },
  Popover: {
    description: 'Displays rich content in a portal, triggered by a button.',
    code: `import { Popover, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function PopoverDemo() {
  return (
    <Popover trigger={<Button variant="outline" size="sm">Set Alert</Button>}>
      <PopoverContent>
        <p className="text-sm font-medium mb-2">Price Alert</p>
        <Input placeholder="Alert price (USD)" />
      </PopoverContent>
    </Popover>
  )
}`,
    preview: () => (
      <div className="flex items-start justify-center p-6 min-h-[180px]">
        <Popover trigger={<Button variant="outline" size="sm">Set Price Alert</Button>}>
          <PopoverContent>
            <p className="text-sm font-medium mb-3">Configure Alert</p>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">Trigger Price (USD)</Label>
                <Input placeholder="e.g. 75,000" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Condition</Label>
                <Select className="h-8 text-xs">
                  <option>Price crosses above</option>
                  <option>Price crosses below</option>
                </Select>
              </div>
              <Button size="sm" className="w-full mt-1">Create Alert</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
  RadioGroup: {
    description: 'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.',
    code: `import { RadioGroupWrapper } from "@/components/ui/radio-group"
import { useState } from "react"

export function RadioGroupDemo() {
  const [value, setValue] = useState("limit")
  return (
    <RadioGroupWrapper
      value={value}
      onValueChange={setValue}
      options={[
        { value: "limit", label: "Limit Order" },
        { value: "market", label: "Market Order" },
        { value: "stop", label: "Stop Order" },
      ]}
    />
  )
}`,
    preview: () => {
      const [orderType, setOrderType] = useState('limit')
      const [tif, setTif] = useState('gtc')
      return (
        <div className="flex gap-8 p-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Order Type</Label>
            <RadioGroupWrapper
              value={orderType}
              onValueChange={setOrderType}
              options={[
                { value: 'limit', label: 'Limit Order' },
                { value: 'market', label: 'Market Order' },
                { value: 'stop', label: 'Stop Order' },
                { value: 'stop-limit', label: 'Stop Limit' },
              ]}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Time in Force</Label>
            <RadioGroupWrapper
              value={tif}
              onValueChange={setTif}
              options={[
                { value: 'gtc', label: 'Good Till Cancelled' },
                { value: 'ioc', label: 'Immediate or Cancel' },
                { value: 'fok', label: 'Fill or Kill' },
              ]}
            />
          </div>
        </div>
      )
    },
  },
  ScrollArea: {
    description: 'Augments native scroll functionality for custom, cross-browser styling.',
    code: `import { ScrollArea } from "@/components/ui/scroll-area"

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-48 rounded-md border border-border p-3">
      {Array.from({length: 20}, (_, i) => (
        <div key={i} className="py-1 text-sm border-b border-border last:border-0">
          Order #{1000 + i}
        </div>
      ))}
    </ScrollArea>
  )
}`,
    preview: () => (
      <div className="p-6 w-full max-w-xs mx-auto">
        <ScrollArea className="h-56 rounded-md border border-border">
          <div className="p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recent Trades</p>
            {[
              { price: '72,814', size: '0.0512', side: 'buy' },
              { price: '72,810', size: '0.1200', side: 'sell' },
              { price: '72,820', size: '0.0089', side: 'buy' },
              { price: '72,815', size: '0.2500', side: 'sell' },
              { price: '72,808', size: '0.0340', side: 'buy' },
              { price: '72,802', size: '0.0750', side: 'sell' },
              { price: '72,818', size: '0.1100', side: 'buy' },
              { price: '72,812', size: '0.0430', side: 'sell' },
              { price: '72,825', size: '0.0210', side: 'buy' },
              { price: '72,807', size: '0.3100', side: 'sell' },
              { price: '72,830', size: '0.0650', side: 'buy' },
              { price: '72,799', size: '0.0180', side: 'sell' },
            ].map((t, i) => (
              <div key={i} className="flex justify-between py-1 text-[11px] font-mono border-b border-border/40 last:border-0">
                <span className={t.side === 'buy' ? 'text-buy' : 'text-sell'}>${t.price}</span>
                <span className="text-muted-foreground">{t.size}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    ),
  },
  Sheet: {
    description: 'Extends the Dialog component to display content that complements the main content of the screen.',
    code: `import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function SheetDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet open={open} onOpenChange={setOpen} side="right">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>BTC-USD Limit Buy · #4821</SheetDescription>
        </SheetHeader>
        <SheetContent>...</SheetContent>
        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </SheetFooter>
      </Sheet>
    </>
  )
}`,
    preview: () => {
      const [open, setOpen] = useState(false)
      return (
        <div className="flex items-center justify-center p-6">
          <Button variant="outline" onClick={() => setOpen(true)}>Open Order Panel</Button>
          <Sheet open={open} onOpenChange={setOpen} side="right">
            <SheetHeader>
              <SheetTitle>Order Details</SheetTitle>
              <SheetDescription>BTC-USD Limit Buy · Order #4821</SheetDescription>
            </SheetHeader>
            <SheetContent>
              <div className="space-y-2 text-sm">
                {[['Pair','BTC-USD'],['Side','Buy'],['Type','Limit'],['Status','Open'],['Price','$69,820.00'],['Amount','0.05 BTC'],['Filled','0.00 BTC'],['Total','$3,491.00'],['Created','Mar 7, 2026 09:41']].map(([k,v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className={cn('font-mono font-medium', k === 'Side' && 'text-buy', k === 'Status' && 'text-primary')}>{v}</span>
                  </div>
                ))}
              </div>
            </SheetContent>
            <SheetFooter>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Close</Button>
              <Button variant="destructive" size="sm" onClick={() => setOpen(false)}>Cancel Order</Button>
            </SheetFooter>
          </Sheet>
        </div>
      )
    },
  },
  Slider: {
    description: 'An input where the user selects a value from within a given range.',
    code: `import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export function SliderDemo() {
  const [leverage, setLeverage] = useState(5)
  return (
    <div className="space-y-3 w-64">
      <div className="flex justify-between text-sm">
        <Label>Leverage</Label>
        <span className="font-mono font-bold text-primary">{leverage}x</span>
      </div>
      <Slider value={leverage} min={1} max={20} step={1} onChange={setLeverage} />
    </div>
  )
}`,
    preview: () => {
      const [leverage, setLeverage] = useState(5)
      const [allocation, setAllocation] = useState(60)
      return (
        <div className="space-y-6 p-6 w-full max-w-xs mx-auto">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <Label>Leverage</Label>
              <span className="font-mono font-bold text-primary">{leverage}x</span>
            </div>
            <Slider value={leverage} min={1} max={20} step={1} onChange={setLeverage} />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1x</span><span>5x</span><span>10x</span><span>20x</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <Label>Portfolio Allocation</Label>
              <span className="font-mono font-bold">{allocation}%</span>
            </div>
            <Slider value={allocation} min={0} max={100} step={5} onChange={setAllocation} />
          </div>
        </div>
      )
    },
  },
  Spinner: {
    description: 'Animated loading indicator for async operations.',
    code: `import { Spinner } from "@/components/ui/spinner"

export function SpinnerDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  )
}`,
    preview: () => (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-6">
          <div className="text-center space-y-2">
            <Spinner size="sm" />
            <p className="text-[10px] text-muted-foreground">sm</p>
          </div>
          <div className="text-center space-y-2">
            <Spinner size="md" />
            <p className="text-[10px] text-muted-foreground">md</p>
          </div>
          <div className="text-center space-y-2">
            <Spinner size="lg" />
            <p className="text-[10px] text-muted-foreground">lg</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner size="sm" />
          <span>Loading order book...</span>
        </div>
        <Button disabled className="w-40 gap-2">
          <Spinner size="sm" />
          Placing Order...
        </Button>
      </div>
    ),
  },
  Toggle: {
    description: 'A two-state button that can be either on or off.',
    code: `import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, Underline } from "lucide-react"

export function ToggleDemo() {
  const [bold, setBold] = useState(false)
  return (
    <Toggle pressed={bold} onPressedChange={setBold} variant="outline">
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}`,
    preview: () => {
      const [candlestick, setCandlestick] = useState(true)
      const [volume, setVolume] = useState(true)
      const [indicators, setIndicators] = useState(false)
      const [alerts, setAlerts] = useState(false)
      return (
        <div className="flex flex-col gap-4 p-6">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Chart Overlays</Label>
            <div className="flex gap-1">
              <Toggle pressed={candlestick} onPressedChange={setCandlestick} variant="outline" size="sm">Candles</Toggle>
              <Toggle pressed={volume} onPressedChange={setVolume} variant="outline" size="sm">Volume</Toggle>
              <Toggle pressed={indicators} onPressedChange={setIndicators} variant="outline" size="sm">Indicators</Toggle>
              <Toggle pressed={alerts} onPressedChange={setAlerts} variant="outline" size="sm">Alerts</Toggle>
            </div>
          </div>
        </div>
      )
    },
  },
  ToggleGroup: {
    description: 'A set of two-state buttons that can be toggled on or off.',
    code: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupDemo() {
  const [timeframe, setTimeframe] = useState("1d")
  return (
    <ToggleGroup value={timeframe} onValueChange={v => v && setTimeframe(v)}>
      <ToggleGroupItem value="1h">1H</ToggleGroupItem>
      <ToggleGroupItem value="4h">4H</ToggleGroupItem>
      <ToggleGroupItem value="1d">1D</ToggleGroupItem>
      <ToggleGroupItem value="1w">1W</ToggleGroupItem>
    </ToggleGroup>
  )
}`,
    preview: () => {
      const [timeframe, setTimeframe] = useState('1d')
      const [chartType, setChartType] = useState('candle')
      return (
        <div className="flex flex-col gap-4 p-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Timeframe</Label>
            <ToggleGroup value={timeframe} onValueChange={v => v && setTimeframe(v as string)}>
              {['1m','5m','15m','1h','4h','1d','1w'].map(t => (
                <ToggleGroupItem key={t} value={t}>{t.toUpperCase()}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Chart Type</Label>
            <ToggleGroup value={chartType} onValueChange={v => v && setChartType(v as string)}>
              <ToggleGroupItem value="candle">Candle</ToggleGroupItem>
              <ToggleGroupItem value="line">Line</ToggleGroupItem>
              <ToggleGroupItem value="area">Area</ToggleGroupItem>
              <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      )
    },
  },
  AspectRatio: {
    description: 'Displays content within a desired ratio.',
    code: `import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
      <img src="/chart-preview.png" className="w-full h-full object-cover" />
    </AspectRatio>
  )
}`,
    preview: () => (
      <div className="p-6 w-full max-w-sm mx-auto">
        <AspectRatio ratio={16 / 9} className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/5 to-buy/5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">BTC-USD · 1D</div>
            <div className="text-3xl font-bold font-mono">$72,814</div>
            <div className="text-xs text-buy">+2.36% today</div>
          </div>
        </AspectRatio>
        <p className="text-xs text-muted-foreground mt-2 text-center">16:9 ratio</p>
      </div>
    ),
  },
  DatePicker: {
    description: 'A date picker component built on top of Popover and Calendar.',
    code: `import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"
import { useState } from "react"

export function DatePickerDemo() {
  const [date, setDate] = useState<Date>()
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({})

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <Label>Settlement Date</Label>
        <DatePicker value={date} onChange={setDate} placeholder="Select date" />
      </div>
      <div className="space-y-1.5">
        <Label>Report Period</Label>
        <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
      </div>
    </div>
  )
}`,
    preview: () => {
      const [date, setDate] = useState<Date | undefined>()
      const [range, setRange] = useState<{ from?: Date; to?: Date }>({})
      return (
        <div className="flex flex-col gap-6 p-6">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Settlement Date</Label>
            <DatePicker value={date} onChange={setDate} placeholder="Pick settlement date" />
            {date && <p className="text-xs text-muted-foreground">Selected: {date.toDateString()}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Report Period</Label>
            <DateRangePicker
              from={range.from}
              to={range.to}
              onChange={setRange}
            />
            {range.from && range.to && (
              <p className="text-xs text-muted-foreground">{Math.round((range.to.getTime() - range.from.getTime()) / 86400000)} days selected</p>
            )}
          </div>
        </div>
      )
    },
  },
}

const SIDEBAR_GROUPS = [
  {
    label: 'Getting Started',
    items: ['Introduction', 'Installation', 'Theming', 'Dark Mode'],
  },
  {
    label: 'Components',
    items: Object.keys(COMPONENTS),
  },
]

/* ─── Bento showcase cards ──────────────────────────────────── */
function BentoOrderForm() {
  const [tab, setTab] = useState('limit')
  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Order Entry</div>
      <div className="flex rounded-lg overflow-hidden border border-border mb-2">
        <button className="flex-1 py-1.5 text-[11px] font-semibold bg-buy-muted text-buy">Buy</button>
        <button className="flex-1 py-1.5 text-[11px] text-muted-foreground hover:text-sell">Sell</button>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="flex-1">
        <TabsList className="border-0">
          <TabsTrigger value="limit" className="text-[10px] px-2 py-1">Limit</TabsTrigger>
          <TabsTrigger value="market" className="text-[10px] px-2 py-1">Market</TabsTrigger>
          <TabsTrigger value="stop" className="text-[10px] px-2 py-1">Stop</TabsTrigger>
        </TabsList>
        <TabsContent value="limit" className="mt-2 space-y-2">
          <div className="space-y-1"><Label className="text-[10px]">Price (USD)</Label><Input defaultValue="69,820.00" className="h-7 text-[11px] font-mono" /></div>
          <div className="space-y-1"><Label className="text-[10px]">Amount (BTC)</Label><Input defaultValue="0.0500" className="h-7 text-[11px] font-mono" /></div>
          <div className="flex gap-0.5">{['25%','50%','75%','Max'].map(p => <button key={p} className="flex-1 text-[9px] py-0.5 rounded border border-border text-muted-foreground hover:border-primary">{p}</button>)}</div>
        </TabsContent>
        <TabsContent value="market" className="mt-2 space-y-2">
          <div className="space-y-1"><Label className="text-[10px]">Amount (USD)</Label><Input placeholder="0.00" className="h-7 text-[11px] font-mono" /></div>
        </TabsContent>
        <TabsContent value="stop" className="mt-2 space-y-2">
          <div className="space-y-1"><Label className="text-[10px]">Stop Price</Label><Input defaultValue="69,500.00" className="h-7 text-[11px] font-mono" /></div>
          <div className="space-y-1"><Label className="text-[10px]">Limit Price</Label><Input defaultValue="69,480.00" className="h-7 text-[11px] font-mono" /></div>
        </TabsContent>
      </Tabs>
      <Separator className="my-2" />
      <div className="space-y-1 text-[11px] mb-2">
        <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-mono">$3,491.00</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-mono text-buy">$0.00</span></div>
      </div>
      <Button variant="buy" size="sm" className="w-full rounded-full text-[11px]">Buy BTC</Button>
    </div>
  )
}

function BentoPriceChart() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">BTC-USD</div>
          <div className="text-xl font-bold font-mono text-foreground">$72,814</div>
          <div className="text-xs text-buy flex items-center gap-1 mt-0.5"><ArrowUpRight className="size-3" />+$1,615 (+2.36%)</div>
        </div>
        <Badge variant="buy" className="text-[10px]">Live</Badge>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="buyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--buy)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--buy)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="price" stroke="var(--buy)" strokeWidth={1.5} fill="url(#buyGrad)" dot={false} />
            <RechartsTooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
              labelFormatter={() => ''}
              formatter={(v) => [`$${Number(v).toLocaleString('en', { maximumFractionDigits: 0 })}`, '']}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 mt-2 text-[10px]">
        {['1H','4H','1D','1W'].map(t => (
          <button key={t} className={cn('text-muted-foreground hover:text-foreground', t === '1D' && 'text-foreground font-semibold')}>{t}</button>
        ))}
      </div>
    </div>
  )
}

function BentoPortfolio() {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Portfolio</div>
        <div className="text-2xl font-bold font-mono">$24,830</div>
        <div className="text-xs text-buy flex items-center gap-1 mt-0.5"><ArrowUpRight className="size-3" />+$1,240 today</div>
      </div>
      <Progress value={68} variant="buy" className="my-2" />
      <div className="space-y-1.5">
        {[
          { t: 'BTC', v: '0.35', usd: '$24,374', pct: 72 },
          { t: 'ETH', v: '2.00', usd: '$6,996',  pct: 21 },
          { t: 'SOL', v: '10.0', usd: '$1,912',  pct: 7  },
        ].map(a => (
          <div key={a.t} className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[8px]">{a.t.slice(0,2)}</AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium flex-1">{a.t}</span>
            <span className="text-[11px] font-mono text-muted-foreground">{a.usd}</span>
            <div className="w-12 bg-muted rounded-full h-1">
              <div className="bg-primary h-1 rounded-full" style={{ width: `${a.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BentoAlerts() {
  const [alerts, setAlerts] = useState([
    { id: 1, pair: 'BTC-USD', price: '$70,000', active: true  },
    { id: 2, pair: 'ETH-USD', price: '$4,000',  active: false },
    { id: 3, pair: 'SOL-USD', price: '$200',    active: true  },
  ])
  const toggle = (id: number) => setAlerts(a => a.map(x => x.id === id ? { ...x, active: !x.active } : x))
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Price Alerts</div>
        <Bell className="size-3 text-muted-foreground" />
      </div>
      <div className="space-y-2 flex-1">
        {alerts.map(a => (
          <div key={a.id} className="flex items-center gap-2">
            <div className={cn('w-1.5 h-1.5 rounded-full', a.active ? 'bg-buy' : 'bg-muted')} />
            <span className="text-[11px] font-medium flex-1">{a.pair}</span>
            <span className="text-[11px] font-mono text-muted-foreground">{a.price}</span>
            <Switch checked={a.active} onChange={() => toggle(a.id)} className="scale-75 origin-right" />
          </div>
        ))}
      </div>
      <Button size="xs" variant="outline" className="w-full mt-2 text-[10px]">+ Add Alert</Button>
    </div>
  )
}

function BentoConfirm() {
  const [done, setDone] = useState(false)
  return (
    <div className="h-full flex flex-col">
      {done ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-full bg-buy-muted flex items-center justify-center">
            <CheckCircle className="size-5 text-buy" />
          </div>
          <p className="text-xs font-semibold text-foreground">Order Submitted</p>
          <p className="text-[11px] text-muted-foreground text-center">Bought 0.05 BTC at $69,820</p>
          <Button size="xs" variant="ghost" onClick={() => setDone(false)} className="text-[10px]">Reset</Button>
        </div>
      ) : (
        <>
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Confirm Order</div>
          <div className="space-y-1.5 flex-1 text-[11px]">
            {[['Pair','BTC-USD'],['Side','Buy'],['Type','Limit'],['Price','$69,820.00'],['Total','$3,491.00'],['Fee','$0.00']].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1 border-b border-border last:border-0">
                <span className="text-muted-foreground">{k}</span>
                <span className={cn('font-mono font-medium', k === 'Side' ? 'text-buy' : k === 'Fee' ? 'text-buy' : 'text-foreground')}>{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-2">
            <Button size="xs" variant="outline" className="flex-1 text-[10px]">Cancel</Button>
            <Button size="xs" variant="buy" className="flex-1 text-[10px]" onClick={() => setDone(true)}>Place Order</Button>
          </div>
        </>
      )}
    </div>
  )
}

function BentoSettings() {
  const [notifications, setNotifications] = useState(true)
  const [advanced, setAdvanced] = useState(false)
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Preferences</div>
      {[
        { label: 'Dark mode',       checked: theme === 'dark',  onChange: toggleTheme },
        { label: 'Price alerts',    checked: notifications,     onChange: () => setNotifications(p => !p) },
        { label: 'Advanced view',   checked: advanced,          onChange: () => setAdvanced(p => !p) },
      ].map(({ label, checked, onChange }) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-xs text-foreground">{label}</span>
          <Switch checked={checked} onChange={onChange} />
        </div>
      ))}
      <Separator />
      <div className="space-y-1.5">
        <Label className="text-[10px]">Default Pair</Label>
        <Select defaultValue="btcusd" className="h-7 text-[11px]">
          <option value="btcusd">BTC-USD</option>
          <option value="ethusd">ETH-USD</option>
        </Select>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export function ShadcnLandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [page, setPage] = useState<'overview' | 'docs'>('overview')
  const [selectedComp, setSelectedComp] = useState('Button')
  const [docTab, setDocTab] = useState<'preview' | 'code'>('preview')
  const comp = COMPONENTS[selectedComp as keyof typeof COMPONENTS]
  const PreviewComponent = comp.preview

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* ── Top nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
        <div className="flex h-12 items-center justify-between px-6">
          {/* Nav */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-0.5">
              {[
                { label: 'Overview',   page: 'overview' as const },
                { label: 'Docs',       page: 'docs' as const },
                { label: 'Components', page: 'docs' as const },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setPage(item.page)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs transition-colors',
                    page === item.page && item.label !== 'Docs'
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
              <Search className="size-3" />
              <span>Search docs...</span>
              <kbd className="ml-1 text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
            </button>
            <a href="https://github.com" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors border border-border">
              <Github className="size-3.5" />
              <span className="font-mono">108k</span>
            </a>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Page body ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {page === 'overview' && (
          <>
            {/* Hero */}
            <section className="relative py-20 px-6 text-center overflow-hidden">
              {/* Subtle grid background */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  opacity: 0.4,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
              <div className="relative max-w-3xl mx-auto">
                <Badge variant="secondary" className="mb-6 text-xs">
                  <Zap className="size-3 mr-1" />New — Components v2.0
                </Badge>
                <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                  The Foundation for your<br />
                  <span className="text-primary">Design System</span>
                </h1>
                <p className="text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                  A set of beautifully designed components built on Tailwind CSS and{' '}
                  <span className="text-foreground font-medium">MarketsUI's design palette</span>.
                  Customize, extend, and make it your own.{' '}
                  <span className="text-foreground font-medium">Open Source. Open Code.</span>
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button size="lg" onClick={() => setPage('docs')}>
                    Get Started <ArrowRight className="size-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setPage('docs')}>
                    Browse Components
                  </Button>
                </div>
              </div>
            </section>

            {/* Bento showcase */}
            <section className="px-6 pb-20 max-w-6xl mx-auto">
              <div className="grid grid-cols-4 grid-rows-2 gap-4" style={{ gridTemplateRows: '280px 220px' }}>

                {/* Chart – 2 cols, 2 rows */}
                <div className="col-span-2 row-span-2 rounded-2xl border border-border bg-card p-4">
                  <BentoPriceChart />
                </div>

                {/* Order form – 1 col, 2 rows */}
                <div className="col-span-1 row-span-2 rounded-2xl border border-border bg-card p-4">
                  <BentoOrderForm />
                </div>

                {/* Portfolio – 1 col, 1 row */}
                <div className="col-span-1 row-span-1 rounded-2xl border border-border bg-card p-4">
                  <BentoPortfolio />
                </div>

                {/* Alerts – 1 col, 1 row */}
                <div className="col-span-1 row-span-1 rounded-2xl border border-border bg-card p-4 row-start-2 col-start-4">
                  <BentoAlerts />
                </div>

              </div>

              {/* Second row */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="rounded-2xl border border-border bg-card p-4" style={{ minHeight: 200 }}>
                  <BentoConfirm />
                </div>
                <div className="rounded-2xl border border-border bg-card p-4" style={{ minHeight: 200 }}>
                  <BentoSettings />
                </div>
                {/* "Built with" info card */}
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 flex flex-col items-center justify-center text-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Palette className="size-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Built with MarketsUI</p>
                  <p className="text-xs text-muted-foreground">MarketsUI palette · Tailwind v4 · shadcn/ui convention</p>
                  <Button size="sm" variant="outline" onClick={() => setPage('docs')} className="mt-1">
                    View all components <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Feature strips */}
            <section className="border-t border-border px-6 py-16">
              <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8">
                {[
                  {
                    icon: <Code2 className="size-5 text-primary" />,
                    title: 'Copy & Paste',
                    desc: 'Components are not a dependency. Copy the source code and own it entirely. No black boxes.',
                  },
                  {
                    icon: <Layers className="size-5 text-primary" />,
                    title: 'Composable',
                    desc: 'Built with composition in mind. Mix and match primitives to build complex UIs for trading.',
                  },
                  {
                    icon: <Palette className="size-5 text-primary" />,
                    title: 'Design Tokens',
                    desc: 'Every color, radius, and shadow comes from the MarketsUI design token system.',
                  },
                ].map(f => (
                  <div key={f.title} className="space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">{f.icon}</div>
                    <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA strip */}
            <section className="border-t border-border px-6 py-16 text-center">
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-3">Start building today</h2>
                <p className="text-sm text-muted-foreground mb-6">All components are open source and free to use in personal and commercial projects.</p>
                <div className="flex items-center justify-center gap-3">
                  <Button size="lg" onClick={() => setPage('docs')}>
                    <Terminal className="size-4" />Browse Components
                  </Button>
                  <Button size="lg" variant="outline">
                    <Github className="size-4" />GitHub
                  </Button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border px-6 py-6">
              <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-primary">
                    <TrendingUp className="size-3 text-primary-foreground" />
                  </div>
                  <span>Built by MarketsUI. Inspired by <span className="text-foreground">shadcn/ui</span>.</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" className="hover:text-foreground transition-colors">Docs</a>
                  <a href="#" className="hover:text-foreground transition-colors">Components</a>
                  <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
                  <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                </div>
              </div>
            </footer>
          </>
        )}

        {page === 'docs' && (
          <div className="flex h-full">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 border-r border-border overflow-y-auto py-6 px-3">
              {SIDEBAR_GROUPS.map(group => (
                <div key={group.label} className="mb-5">
                  <p className="px-2 mb-1.5 text-[11px] font-semibold text-foreground uppercase tracking-wider">{group.label}</p>
                  {group.items.map(item => {
                    const isComp = group.label === 'Components'
                    const active = isComp && selectedComp === item
                    return (
                      <button
                        key={item}
                        onClick={() => { if (isComp) setSelectedComp(item); setDocTab('preview') }}
                        className={cn(
                          'w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors',
                          active
                            ? 'bg-accent text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              ))}
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto py-8 px-8 max-w-3xl">
              {COMPONENTS[selectedComp as keyof typeof COMPONENTS] ? (
                <>
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-4">
                    <span>Docs</span>
                    <ChevronRight className="size-3" />
                    <span>Components</span>
                    <ChevronRight className="size-3" />
                    <span className="text-foreground">{selectedComp}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl font-bold text-foreground mb-2">{selectedComp}</h1>
                  <p className="text-sm text-muted-foreground mb-6">{comp.description}</p>

                  {/* Install command */}
                  <div className="mb-6">
                    <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Installation</h2>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-[#0c0e12] px-4 py-3">
                      <Terminal className="size-3.5 text-muted-foreground shrink-0" />
                      <code className="text-[12px] font-mono text-[#e2e8f0] flex-1">
                        npx marketsui@latest add {selectedComp.toLowerCase()}
                      </code>
                      <button className="text-muted-foreground hover:text-foreground">
                        <Copy className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Preview / Code tabs */}
                  <div className="mb-8">
                    <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Preview</h2>
                    <Tabs value={docTab} onValueChange={v => setDocTab(v as 'preview' | 'code')}>
                      <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                      </TabsList>
                      <TabsContent value="preview">
                        <div className="mt-3 rounded-xl border border-border bg-background min-h-32">
                          <PreviewComponent key={selectedComp} />
                        </div>
                      </TabsContent>
                      <TabsContent value="code">
                        <div className="mt-3">
                          <CodeBlock code={comp.code} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Usage */}
                  <div className="mb-8">
                    <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Usage</h2>
                    <CodeBlock code={`import { ${selectedComp} } from "@/components/ui/${selectedComp.toLowerCase()}"`} />
                  </div>

                  {/* Navigation between components */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    {(() => {
                      const all = Object.keys(COMPONENTS)
                      const idx = all.indexOf(selectedComp)
                      const prev = all[idx - 1]
                      const next = all[idx + 1]
                      return (
                        <>
                          {prev ? (
                            <button onClick={() => { setSelectedComp(prev); setDocTab('preview') }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              ← {prev}
                            </button>
                          ) : <div />}
                          {next ? (
                            <button onClick={() => { setSelectedComp(next); setDocTab('preview') }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              {next} →
                            </button>
                          ) : <div />}
                        </>
                      )
                    })()}
                  </div>
                </>
              ) : (
                /* Non-component pages */
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-foreground">{selectedComp}</h1>
                  <p className="text-sm text-muted-foreground">Documentation for this section is coming soon.</p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedComp('Button')}>
                    Browse Components <ArrowRight className="size-3" />
                  </Button>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}
