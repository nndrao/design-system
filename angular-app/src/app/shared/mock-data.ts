export interface WatchlistItem {
  symbol: string;
  name: string;
  last: number;
  change: number;
  changePct: number;
  volume: number;
}

export interface Position {
  symbol: string;
  side: 'BUY' | 'SELL';
  qty: number;
  entry: number;
  current: number;
  pnl: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
}

export const WATCHLIST_DATA: WatchlistItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', last: 263.90, change: -0.82, changePct: -0.31, volume: 54_320_000 },
  { symbol: 'AMC', name: 'AMC Entertainment', last: 1.15, change: 0.01, changePct: 0.88, volume: 12_450_000 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', last: 196.29, change: -2.33, changePct: -1.17, volume: 43_210_000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', last: 207.25, change: -1.14, changePct: -0.55, volume: 38_100_000 },
  { symbol: 'DIS', name: 'Walt Disney Co.', last: 104.10, change: -0.23, changePct: -0.22, volume: 8_760_000 },
  { symbol: 'F', name: 'Ford Motor Co.', last: 13.39, change: 0.00, changePct: 0.00, volume: 28_300_000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', last: 304.23, change: -2.29, changePct: -0.75, volume: 21_500_000 },
  { symbol: 'META', name: 'Meta Platforms Inc.', last: 582.45, change: 3.21, changePct: 0.55, volume: 15_800_000 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', last: 396.75, change: -1.80, changePct: -0.45, volume: 22_400_000 },
  { symbol: 'NFLX', name: 'Netflix Inc.', last: 96.35, change: -0.74, changePct: -0.76, volume: 7_200_000 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', last: 181.40, change: -1.08, changePct: -0.59, volume: 112_450_000 },
  { symbol: 'RIVN', name: 'Rivian Automotive', last: 15.03, change: 0.02, changePct: 0.13, volume: 19_800_000 },
  { symbol: 'TSLA', name: 'Tesla Inc.', last: 401.97, change: -1.42, changePct: -0.35, volume: 98_300_000 },
];

export const POSITIONS_DATA: Position[] = [
  { symbol: 'AAPL', side: 'BUY', qty: 100, entry: 258.50, current: 263.90, pnl: 540.00 },
  { symbol: 'NVDA', side: 'BUY', qty: 50, entry: 175.20, current: 181.40, pnl: 310.00 },
  { symbol: 'TSLA', side: 'SELL', qty: 25, entry: 410.00, current: 401.97, pnl: 200.75 },
  { symbol: 'AMD', side: 'BUY', qty: 75, entry: 200.10, current: 196.29, pnl: -285.75 },
  { symbol: 'GOOGL', side: 'BUY', qty: 30, entry: 298.00, current: 304.23, pnl: 186.90 },
  { symbol: 'AMZN', side: 'SELL', qty: 40, entry: 195.80, current: 207.25, pnl: -458.00 },
];

export const ORDER_BOOK_BIDS: OrderBookLevel[] = [
  { price: 263.88, size: 1200 },
  { price: 263.85, size: 3400 },
  { price: 263.82, size: 800 },
  { price: 263.80, size: 5200 },
  { price: 263.78, size: 2100 },
  { price: 263.75, size: 4500 },
  { price: 263.72, size: 1800 },
  { price: 263.70, size: 6700 },
];

export const ORDER_BOOK_ASKS: OrderBookLevel[] = [
  { price: 263.90, size: 900 },
  { price: 263.93, size: 2800 },
  { price: 263.95, size: 1500 },
  { price: 263.98, size: 4100 },
  { price: 264.00, size: 3200 },
  { price: 264.03, size: 1900 },
  { price: 264.05, size: 5600 },
  { price: 264.08, size: 2400 },
];

export const CHART_DATA = [
  { time: '09:30', close: 262.40 },
  { time: '10:00', close: 262.90 },
  { time: '10:30', close: 263.20 },
  { time: '11:00', close: 263.80 },
  { time: '11:30', close: 264.10 },
  { time: '12:00', close: 263.60 },
  { time: '12:30', close: 264.00 },
  { time: '13:00', close: 264.50 },
  { time: '13:30', close: 264.60 },
  { time: '14:00', close: 264.00 },
  { time: '14:30', close: 263.80 },
  { time: '15:00', close: 264.10 },
  { time: '15:30', close: 263.90 },
];

export function formatPrice(value: number): string {
  return value.toFixed(2);
}

export function formatChange(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}`;
}

export function formatPercent(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}
