import { themeQuartz } from 'ag-grid-community'

/**
 * MarketsUI AG Grid theme – parameter-based theming built on themeQuartz.
 * Light/dark modes are selected via `document.documentElement.dataset.agThemeMode`
 * which ThemeProvider keeps in sync with the app theme.
 */
export const marketsUITheme = themeQuartz
  .withParams(
    {
      accentColor: '#1652f0',
      backgroundColor: '#ffffff',
      foregroundColor: '#0d1117',
      headerBackgroundColor: '#ffffff',
      headerForegroundColor: '#4b5563',
      headerFontSize: 10,
      borderColor: '#e4e7ec',
      rowHoverColor: '#f0f2f5',
      selectedRowBackgroundColor: 'rgba(22,82,240,0.05)',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: 11,
      rowHeight: 36,
      headerHeight: 30,
      wrapperBorderRadius: '12px',
      cellHorizontalPaddingScale: 0.7,
      browserColorScheme: 'light',
    },
    'light',
  )
  .withParams(
    {
      accentColor: '#2563eb',
      backgroundColor: '#13161c',
      foregroundColor: '#f0f2f5',
      headerBackgroundColor: '#13161c',
      headerForegroundColor: '#8a94a6',
      headerFontSize: 10,
      borderColor: '#222630',
      rowHoverColor: 'rgba(34,38,48,0.8)',
      selectedRowBackgroundColor: 'rgba(37,99,235,0.08)',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: 11,
      rowHeight: 36,
      headerHeight: 30,
      wrapperBorderRadius: '12px',
      cellHorizontalPaddingScale: 0.7,
      browserColorScheme: 'dark',
    },
    'dark',
  )
