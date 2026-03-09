import { cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, PieChart, Pie, Legend } from 'recharts'
import { BASE_POSITIONS, fmtDV01, fmtPnL } from './marketData'

const DV01_BY_TENOR = [
  { tenor: '0-1Y',   dv01: -30_000  },
  { tenor: '1-2Y',   dv01:  38_276  },
  { tenor: '2-5Y',   dv01: 112_175  },
  { tenor: '5-10Y',  dv01: 263_100  },
  { tenor: '10-20Y', dv01: -133_755 },
  { tenor: '20-30Y', dv01: 171_149  },
]

const CREDIT_EXPOSURE = [
  { name: 'Financials', value: 156_468, cs01: 32_184 },
  { name: 'Technology', value: 38_623,  cs01: 11_482 },
  { name: 'CDX Index',  value: 24_100,  cs01: 24_100 },
].filter(c => c.cs01 > 0)

const PIE_COLORS = ['var(--color-primary)', 'var(--color-buy)', 'var(--color-warning)']

const RISK_LIMITS = [
  { metric: 'Net DV01',          current: 420_945,   limit: 600_000   },
  { metric: 'Gross DV01',        current: 1_165_955, limit: 1_500_000 },
  { metric: 'Net CS01',          current: 57_182,    limit: 100_000   },
  { metric: 'IG Credit Exp.',    current: 195_091,   limit: 300_000   },
  { metric: 'HY Credit Exp.',    current: 0,         limit: 75_000    },
  { metric: 'Single-tenor DV01', current: 263_100,   limit: 400_000   },
  { metric: 'Max Loss (1-day)',  current: 93_170,    limit: 500_000   },
]

const VAR_DATA = [
  { confidence: '95%',   var1d: 285_000, var10d: 901_000   },
  { confidence: '99%',   var1d: 412_000, var10d: 1_303_000 },
  { confidence: '99.9%', var1d: 594_000, var10d: 1_878_000 },
]

const STRESS_SCENARIOS = [
  { scenario: '+25bp parallel',   pnl: -105_236 },
  { scenario: '+50bp parallel',   pnl: -210_473 },
  { scenario: '+100bp parallel',  pnl: -420_945 },
  { scenario: '-25bp parallel',   pnl: +105_236 },
  { scenario: 'Steepen +25bp',    pnl: -48_120  },
  { scenario: 'Flatten +25bp',    pnl: +31_840  },
  { scenario: 'Credit +50bp',     pnl: -28_591  },
  { scenario: 'Credit +100bp',    pnl: -57_182  },
  { scenario: '2008 credit shock',pnl: -342_500 },
]

function LimitBar({ metric, current, limit }: { metric: string; current: number; limit: number }) {
  const pct = Math.min((current / limit) * 100, 100)
  const color = pct >= 90 ? 'bg-sell' : pct >= 70 ? 'bg-warning' : 'bg-buy'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-muted-foreground">{metric}</span>
        <span className="font-mono text-[10px]">${(current / 1000).toFixed(0)}K / ${(limit / 1000).toFixed(0)}K</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: pct + '%' }} />
      </div>
      <div className="text-[9px] text-muted-foreground">{pct.toFixed(0)}% used</div>
    </div>
  )
}

export function RiskPanel() {
  const totalDV01 = BASE_POSITIONS.reduce((s, p) => s + p.dv01, 0)
  const totalCS01 = BASE_POSITIONS.reduce((s, p) => s + p.cs01, 0)
  const totalPnl  = BASE_POSITIONS.reduce((s, p) => s + p.pnlToday, 0)

  return (
    <div className="h-full flex flex-col gap-3 p-3 overflow-hidden">

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        {[
          { label: 'Net DV01',       value: fmtDV01(totalDV01), sub: '$/bp rate sensitivity', cls: '' },
          { label: 'Net CS01',       value: fmtDV01(totalCS01), sub: '$/bp credit sensitivity', cls: '' },
          { label: 'P&L Today',      value: fmtPnL(totalPnl),   sub: 'Mark-to-market', cls: totalPnl >= 0 ? 'text-buy' : 'text-sell' },
          { label: '1-Day VaR (99%)',value: '$412K',            sub: 'Historical simulation',  cls: 'text-warning' },
        ].map(({ label, value, sub, cls }) => (
          <div key={label} className="bg-card border border-border rounded-xl px-4 py-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</div>
            <div className={cn('text-xl font-semibold font-mono mt-0.5 leading-tight', cls)}>{value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Main content: 3 columns */}
      <div className="flex-1 min-h-0 grid grid-cols-3 gap-3">

        {/* Col 1: DV01 by tenor bar chart */}
        <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border shrink-0">
            <span className="text-xs font-semibold">DV01 by Tenor Bucket</span>
            <span className="ml-2 text-[10px] text-muted-foreground">$ per basis point</span>
          </div>
          <div className="flex-1 p-3 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DV01_BY_TENOR} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="tenor" tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'K'} width={42} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11 }}
                  formatter={(v: any) => ['$' + Math.abs(v).toLocaleString(), 'DV01']}
                />
                <ReferenceLine y={0} stroke="var(--color-border)" strokeWidth={1} />
                <Bar dataKey="dv01" radius={[3, 3, 0, 0]}>
                  {DV01_BY_TENOR.map((d, i) => (
                    <Cell key={i} fill={d.dv01 >= 0 ? 'var(--color-buy)' : 'var(--color-sell)'} fillOpacity={0.75} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Col 2: Risk limits */}
        <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border shrink-0">
            <span className="text-xs font-semibold">Risk Limits</span>
            <span className="ml-2 text-[10px] text-muted-foreground">RATES-01 / CREDIT-01</span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {RISK_LIMITS.map(l => <LimitBar key={l.metric} {...l} />)}
          </div>
        </div>

        {/* Col 3: CS01 pie + VaR */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* CS01 pie */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shrink-0">
            <div className="px-4 py-2.5 border-b border-border">
              <span className="text-xs font-semibold">CS01 by Sector</span>
            </div>
            <div className="p-1 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CREDIT_EXPOSURE}
                    dataKey="cs01"
                    nameKey="name"
                    cx="50%" cy="44%"
                    outerRadius={62}
                    innerRadius={30}
                    paddingAngle={2}
                    label={({ percent }: { percent?: number }) => (percent ?? 0) > 0.05 ? `${((percent ?? 0) * 100).toFixed(0)}%` : ''}
                    labelLine={false}
                  >
                    {CREDIT_EXPOSURE.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.85} />
                    ))}
                  </Pie>
                  <Legend iconSize={7} iconType="circle" formatter={(v) => <span style={{ fontSize: 10 }}>{v}</span>} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11 }}
                    formatter={(v: any) => ['$' + v.toLocaleString(), 'CS01']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* VaR table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="px-4 py-2.5 border-b border-border shrink-0">
              <span className="text-xs font-semibold">Value-at-Risk</span>
              <span className="ml-2 text-[10px] text-muted-foreground">1Y historical</span>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-right">
                  <th className="text-left px-4 py-1.5 font-medium">Confidence</th>
                  <th className="px-2 py-1.5 font-medium">1-Day</th>
                  <th className="px-4 py-1.5 font-medium">10-Day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {VAR_DATA.map(v => (
                  <tr key={v.confidence} className="text-right hover:bg-secondary/40">
                    <td className="text-left px-4 py-2 text-muted-foreground">{v.confidence}</td>
                    <td className="px-2 py-2 text-sell">${v.var1d.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sell/70">${v.var10d.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2.5 border-t border-border space-y-1.5 text-[11px] mt-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ES (99%)</span>
                <span className="font-mono text-sell">$528,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Drawdown (30d)</span>
                <span className="font-mono text-sell">$184,230</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stress scenarios — horizontal grid at bottom */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shrink-0">
        <div className="px-4 py-2 border-b border-border">
          <span className="text-xs font-semibold">Stress Scenarios</span>
          <span className="ml-2 text-[10px] text-muted-foreground">Instantaneous shocks</span>
        </div>
        <div className="grid grid-cols-9 divide-x divide-border">
          {STRESS_SCENARIOS.map(s => (
            <div key={s.scenario} className="px-3 py-2 text-[10px]">
              <div className="text-muted-foreground leading-tight mb-1">{s.scenario}</div>
              <div className={cn('font-mono font-semibold', s.pnl >= 0 ? 'text-buy' : 'text-sell')}>
                {fmtPnL(s.pnl)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
