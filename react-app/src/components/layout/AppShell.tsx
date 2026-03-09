import { useState } from 'react'
import { Header } from './Header'
import { ShadcnLandingPage } from '@/components/ShadcnLandingPage'
import { FITradingApp } from '@/components/trading/fi/FITradingApp'

export type AppTab = 'Dashboard' | 'Components'

export function AppShell() {
  const [activeTab, setActiveTab] = useState<AppTab>('Dashboard')

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'Components' ? (
        <ShadcnLandingPage />
      ) : (
        <div className="flex-1 overflow-hidden">
          <FITradingApp />
        </div>
      )}
    </div>
  )
}
