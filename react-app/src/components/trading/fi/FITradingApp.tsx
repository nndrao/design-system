import 'dockview/dist/styles/dockview.css'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { DockviewReact, type DockviewReadyEvent, type IDockviewPanelProps, themeLight, themeDark } from 'dockview'
import { useTheme } from '@/components/theme/ThemeProvider'
import { useLiveMarketData, fmtYield, fmtChgBps } from './marketData'
import { DockviewApiContext } from './DockviewApiContext'
import { MarketDataContext, useMarketData } from './MarketDataContext'
import { DashboardPanel } from './DashboardPanel'
import { RatesPanel } from './RatesPanel'
import { CreditPanel } from './CreditPanel'
import { FuturesPanel } from './FuturesPanel'
import { BlotterPanel } from './BlotterPanel'
import { PositionsPanel } from './PositionsPanel'
import { RiskPanel } from './RiskPanel'
import type { DockviewApi } from 'dockview'

// Panel components defined outside to keep stable references.
// They use React context (MarketDataContext, DockviewApiContext) for data.
const FI_COMPONENTS: Record<string, React.FC<IDockviewPanelProps>> = {
  dashboard: function DashboardWrapper() {
    const data = useMarketData()
    return <DashboardPanel treasuries={data.treasuries} corpBonds={data.corpBonds} yieldCurve={data.yieldCurve} cdxIndices={data.cdxIndices} />
  },
  rates: function RatesWrapper() {
    const data = useMarketData()
    return <RatesPanel treasuries={data.treasuries} yieldCurve={data.yieldCurve} />
  },
  credit: function CreditWrapper() {
    const data = useMarketData()
    return <CreditPanel corpBonds={data.corpBonds} cdxIndices={data.cdxIndices} cdsNames={data.cdsNames} />
  },
  futures: function FuturesWrapper() {
    const data = useMarketData()
    return <FuturesPanel tFutures={data.tFutures} sofrFutures={data.sofrFutures} />
  },
  blotter: function BlotterWrapper() {
    return <BlotterPanel />
  },
  positions: function PositionsWrapper() {
    return <PositionsPanel />
  },
  risk: function RiskWrapper() {
    return <RiskPanel />
  },
}

function setupFILayout(event: DockviewReadyEvent) {
  const api = event.api

  // All panels in a single tabbed group — matches the tablist layout
  api.addPanel({ id: 'dashboard', component: 'dashboard', title: 'Overview' })
  api.addPanel({ id: 'rates',     component: 'rates',     title: 'Rates',           position: { referencePanel: 'dashboard', direction: 'within-group' } })
  api.addPanel({ id: 'credit',    component: 'credit',    title: 'Credit',          position: { referencePanel: 'dashboard', direction: 'within-group' } })
  api.addPanel({ id: 'futures',   component: 'futures',   title: 'Futures',         position: { referencePanel: 'dashboard', direction: 'within-group' } })
  api.addPanel({ id: 'risk',      component: 'risk',      title: 'Risk',            position: { referencePanel: 'dashboard', direction: 'within-group' } })
  api.addPanel({ id: 'positions', component: 'positions', title: 'Positions & P&L', position: { referencePanel: 'dashboard', direction: 'within-group' } })
  api.addPanel({ id: 'blotter',   component: 'blotter',   title: 'Order Blotter',   position: { referencePanel: 'dashboard', direction: 'within-group' } })

  // Land on Overview
  api.getPanel('dashboard')?.api.setActive()
}

function useMarketTime() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const h = time.getHours()
  const isOpen = h >= 8 && h < 17
  const timeStr = time.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return { timeStr, isOpen }
}

export function FITradingApp() {
  const marketData = useLiveMarketData()
  const { timeStr, isOpen } = useMarketTime()
  const { theme } = useTheme()
  const [dvApi, setDvApi] = useState<DockviewApi | null>(null)

  const { treasuries, cdxIndices } = marketData
  const tsy2Y  = treasuries.find(t => t.tenor === '2Y')
  const tsy5Y  = treasuries.find(t => t.tenor === '5Y')
  const tsy10Y = treasuries.find(t => t.tenor === '10Y')
  const tsy30Y = treasuries.find(t => t.tenor === '30Y')
  const cdxIG  = cdxIndices.find(c => c.name.includes('NA.IG') && c.tenor === '5Y')
  const cdxHY  = cdxIndices.find(c => c.name.includes('NA.HY'))
  const slope  = tsy2Y && tsy10Y ? Math.round((tsy10Y.bidYield - tsy2Y.bidYield) * 100) : -34

  function handleReady(event: DockviewReadyEvent) {
    setDvApi(event.api)
    setupFILayout(event)
  }

  return (
    <DockviewApiContext.Provider value={dvApi}>
      <MarketDataContext.Provider value={marketData}>
        <div className="flex flex-col h-full overflow-hidden bg-background">
          {/* Market Status Bar */}
          <div className="flex items-center gap-0 border-b border-border bg-card px-3 h-7 shrink-0 text-[11px] font-mono overflow-x-auto">
            <div className="flex items-center gap-1.5 pr-3 mr-3 border-r border-border shrink-0">
              <span className={cn('w-1.5 h-1.5 rounded-full', isOpen ? 'bg-buy' : 'bg-sell')} />
              <span className="text-muted-foreground">{isOpen ? 'OPEN' : 'CLOSED'}</span>
            </div>

            {[
              { label: '2Y',  val: tsy2Y,  chg: tsy2Y?.change },
              { label: '5Y',  val: tsy5Y,  chg: tsy5Y?.change },
              { label: '10Y', val: tsy10Y, chg: tsy10Y?.change },
              { label: '30Y', val: tsy30Y, chg: tsy30Y?.change },
            ].map(({ label, val, chg }) => (
              <div key={label} className="flex items-center gap-1 pr-3 mr-3 border-r border-border shrink-0">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">{val ? fmtYield(val.bidYield) : '—'}</span>
                {chg !== undefined && (
                  <span className={cn('text-[10px]', chg < 0 ? 'text-buy' : 'text-sell')}>
                    {fmtChgBps(chg)}
                  </span>
                )}
              </div>
            ))}

            <div className="flex items-center gap-1 pr-3 mr-3 border-r border-border shrink-0">
              <span className="text-muted-foreground">2s10s</span>
              <span className={cn(slope < 0 ? 'text-sell' : 'text-buy')}>{slope > 0 ? '+' : ''}{slope}</span>
            </div>

            {cdxIG && (
              <div className="flex items-center gap-1 pr-3 mr-3 border-r border-border shrink-0">
                <span className="text-muted-foreground">CDX IG</span>
                <span className="text-foreground">{((cdxIG.bidSpread + cdxIG.askSpread) / 2).toFixed(1)}</span>
                <span className={cn('text-[10px]', cdxIG.change > 0 ? 'text-sell' : 'text-buy')}>
                  {cdxIG.change > 0 ? '+' : ''}{cdxIG.change.toFixed(1)}
                </span>
              </div>
            )}

            {cdxHY && (
              <div className="flex items-center gap-1 pr-3 mr-3 border-r border-border shrink-0">
                <span className="text-muted-foreground">CDX HY</span>
                <span className="text-foreground">{((cdxHY.bidSpread + cdxHY.askSpread) / 2).toFixed(0)}</span>
                <span className={cn('text-[10px]', cdxHY.change > 0 ? 'text-sell' : 'text-buy')}>
                  {cdxHY.change > 0 ? '+' : ''}{cdxHY.change.toFixed(1)}
                </span>
              </div>
            )}

            <div className="ml-auto pl-3 border-l border-border shrink-0 text-muted-foreground">
              {timeStr} ET
            </div>
          </div>

          {/* Dockview layout */}
          <div className="flex-1 overflow-hidden">
            <DockviewReact
              components={FI_COMPONENTS}
              onReady={handleReady}
              theme={theme === 'dark' ? themeDark : themeLight}
            />
          </div>
        </div>
      </MarketDataContext.Provider>
    </DockviewApiContext.Provider>
  )
}
