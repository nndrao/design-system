import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CHART_DATA } from '@/lib/mock-data'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PriceDisplay } from './PriceDisplay'

const timeframes = ['1D', '1W', '1M', '3M', 'YTD', '1Y', '5Y', 'All']

export function ChartPanel() {
  const [activeTimeframe, setActiveTimeframe] = useState('1D')

  return (
    <div className="bg-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <PriceDisplay symbol="AAPL" price={263.90} change={-0.82} changePct={-0.31} />
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--buy)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--buy)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              tickFormatter={(v: number) => `$${v}`}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '11px',
              }}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="var(--buy)"
              strokeWidth={1.5}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-t border-border">
        {timeframes.map(tf => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={cn(
              'px-2 py-0.5 text-[10px] rounded transition-colors',
              activeTimeframe === tf
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            {tf}
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-[10px] text-muted-foreground">Interval: 5m</span>
      </div>
    </div>
  )
}
