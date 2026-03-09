import 'dockview/dist/styles/dockview.css'
import { DockviewReact, type DockviewReadyEvent, type IDockviewPanelProps, themeLight, themeDark } from 'dockview'
import { useTheme } from '@/components/theme/ThemeProvider'
import { ChartPanel } from '@/components/trading/ChartPanel'
import { Watchlist } from '@/components/trading/Watchlist'
import { OrderEntry } from '@/components/trading/OrderEntry'
import { OrderBook } from '@/components/trading/OrderBook'
import { PositionsTable } from '@/components/trading/PositionsTable'

const components: Record<string, React.FunctionComponent<IDockviewPanelProps>> = {
  chart: () => <ChartPanel />,
  watchlist: () => <Watchlist />,
  orderEntry: () => <OrderEntry />,
  orderBook: () => <OrderBook />,
  positions: () => <PositionsTable />,
}

function onReady(event: DockviewReadyEvent) {
  const api = event.api

  // Left column: Chart (top-left)
  const chartPanel = api.addPanel({
    id: 'chart',
    component: 'chart',
    title: 'Chart',
  })

  // Watchlist below chart
  api.addPanel({
    id: 'watchlist',
    component: 'watchlist',
    title: 'Watchlist',
    position: { referencePanel: chartPanel, direction: 'below' },
  })

  // Order Entry to the right of chart
  const orderEntryPanel = api.addPanel({
    id: 'orderEntry',
    component: 'orderEntry',
    title: 'Order Entry',
    position: { referencePanel: chartPanel, direction: 'right' },
  })

  // Order Book below Order Entry
  api.addPanel({
    id: 'orderBook',
    component: 'orderBook',
    title: 'Order Book',
    position: { referencePanel: orderEntryPanel, direction: 'below' },
  })

  // Positions spanning full width at the bottom
  api.addPanel({
    id: 'positions',
    component: 'positions',
    title: 'Positions',
    position: { direction: 'below' },
  })

  // Set proportions
  chartPanel.api.setSize({ width: 700 })
  api.getPanel('positions')!.api.setSize({ height: 220 })
}

export function DockviewLayout() {
  const { theme } = useTheme()

  return (
    <div style={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
      <DockviewReact
        components={components}
        onReady={onReady}
        theme={theme === 'dark' ? themeDark : themeLight}
      />
    </div>
  )
}
