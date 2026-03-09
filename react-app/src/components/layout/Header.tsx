import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme/ThemeProvider'
import { Sun, Moon, Search, Palette } from 'lucide-react'
import type { AppTab } from './AppShell'

function MarketsUIIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#1652f0"/>
      <polyline
        points="4,22 9,16 13,18.5 19,8 25,12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="12" r="3" fill="white"/>
    </svg>
  )
}

const TABS: AppTab[] = ['Dashboard', 'Components']

interface HeaderProps {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 h-11 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <MarketsUIIcon />
          <span className="text-sm tracking-tight">MarketsUI</span>
        </div>
        <nav className="flex items-center">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab
                  ? 'text-foreground border-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab === 'Components' && <Palette className="w-3 h-3" />}
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-secondary border border-border rounded-full hover:text-foreground hover:border-border/80 transition-colors">
          <Search className="w-3 h-3" />
          <span>Search...</span>
          <kbd className="text-[10px] bg-accent px-1.5 rounded font-sans">⌘K</kbd>
        </button>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  )
}
