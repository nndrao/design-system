import { Injectable, signal } from '@angular/core'
import { BehaviorSubject, interval } from 'rxjs'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Treasury {
  tenor: string
  label: string
  cusip: string
  coupon: number
  maturity: string
  bidYield: number
  askYield: number
  bidPrice: number
  askPrice: number
  modDuration: number
  dv01PerMM: number
  change: number
}

export interface CorpBond {
  id: string
  issuer: string
  description: string
  cusip: string
  sector: string
  coupon: number
  maturity: string
  ratingMoodys: string
  ratingSP: string
  bidYield: number
  askYield: number
  bidPrice: number
  askPrice: number
  zSpread: number
  oas: number
  modDuration: number
  dv01PerMM: number
  change: number
  isHY: boolean
}

export interface TreasuryFuture {
  symbol: string
  description: string
  contract: string
  bidPrice: number
  askPrice: number
  lastPrice: number
  change: number
  settle: number
  high: number
  low: number
  dv01PerContract: number
  openInterest: number
  volume: number
  impliedYield: number
}

export interface SOFRFuture {
  symbol: string
  contract: string
  price: number
  change: number
  impliedRate: number
  volume: number
  openInterest: number
}

export interface CDXIndex {
  name: string
  series: number
  tenor: string
  bidSpread: number
  askSpread: number
  change: number
  spreadDuration: number
}

export interface CDS {
  name: string
  ticker: string
  sector: string
  ratingMoodys: string
  ratingSP: string
  bid: number
  ask: number
  change: number
}

export interface Position {
  id: string
  security: string
  description: string
  cusip: string
  assetClass: 'Treasury' | 'Corporate' | 'Future' | 'CDS'
  direction: 'Long' | 'Short'
  faceValueMM: number
  avgPrice: number
  currentPrice: number
  currentYield: number
  marketValueMM: number
  modDuration: number
  dv01: number
  cs01: number
  pnlToday: number
  pnlMtd: number
  pnlYtd: number
}

export interface Order {
  id: string
  time: string
  security: string
  description: string
  cusip: string
  side: 'Buy' | 'Sell'
  faceValueMM: number
  limitYield: number | null
  limitPrice: number | null
  filledMM: number
  avgFillYield: number | null
  avgFillPrice: number | null
  status: 'Working' | 'Partial' | 'Filled' | 'Cancelled'
  account: string
  counterparty: string
  venue: string
  trader: string
}

export interface YieldCurvePoint {
  tenor: string
  yield: number
  prevYield: number
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export const fmtYield  = (y: number) => y.toFixed(3) + '%'
export const fmtPrice  = (p: number) => p.toFixed(3)
export const fmtBps    = (b: number) => (b >= 0 ? '+' : '') + b.toFixed(1) + ' bps'
export const fmtChgBps = (b: number) => (b >= 0 ? '+' : '') + b.toFixed(1)
export const fmtMM     = (n: number) => '$' + Math.abs(n).toFixed(0) + 'MM'
export const fmtPnL    = (n: number) => (n >= 0 ? '+' : '-') + '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
export const fmtDV01   = (n: number) => '$' + Math.abs(Math.round(n)).toLocaleString()
export const fmtK      = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (Math.abs(n) >= 1_000)     return (n / 1_000).toFixed(0) + 'K'
  return n.toFixed(0)
}

// ─── Base data ────────────────────────────────────────────────────────────────

export const BASE_YIELD_CURVE: YieldCurvePoint[] = [
  { tenor: '1M',  yield: 5.280, prevYield: 5.275 },
  { tenor: '3M',  yield: 5.220, prevYield: 5.210 },
  { tenor: '6M',  yield: 5.010, prevYield: 5.005 },
  { tenor: '1Y',  yield: 4.900, prevYield: 4.905 },
  { tenor: '2Y',  yield: 4.720, prevYield: 4.740 },
  { tenor: '3Y',  yield: 4.610, prevYield: 4.625 },
  { tenor: '5Y',  yield: 4.470, prevYield: 4.480 },
  { tenor: '7Y',  yield: 4.430, prevYield: 4.445 },
  { tenor: '10Y', yield: 4.380, prevYield: 4.390 },
  { tenor: '20Y', yield: 4.560, prevYield: 4.555 },
  { tenor: '30Y', yield: 4.610, prevYield: 4.600 },
]

export const BASE_TREASURIES: Treasury[] = [
  { tenor: '1M',  label: 'UST 5.250% Apr-26', cusip: '912796YQ1', coupon: 5.250, maturity: 'Apr-26', bidYield: 5.280, askYield: 5.290, bidPrice: 99.556,  askPrice: 99.547,  modDuration: 0.083,  dv01PerMM: 83,    change: +0.5 },
  { tenor: '3M',  label: 'UST 5.200% Jun-26', cusip: '912796YW8', coupon: 5.200, maturity: 'Jun-26', bidYield: 5.220, askYield: 5.230, bidPrice: 98.687,  askPrice: 98.682,  modDuration: 0.247,  dv01PerMM: 247,   change: +1.0 },
  { tenor: '6M',  label: 'UST 5.000% Sep-26', cusip: '912796ZA5', coupon: 5.000, maturity: 'Sep-26', bidYield: 5.010, askYield: 5.020, bidPrice: 97.509,  askPrice: 97.504,  modDuration: 0.490,  dv01PerMM: 490,   change: +0.5 },
  { tenor: '1Y',  label: 'UST 4.875% Mar-27', cusip: '912796ZH0', coupon: 4.875, maturity: 'Mar-27', bidYield: 4.900, askYield: 4.910, bidPrice: 99.976,  askPrice: 99.967,  modDuration: 0.963,  dv01PerMM: 963,   change: -0.5 },
  { tenor: '2Y',  label: 'UST 4.625% Feb-28', cusip: '91282CKF3', coupon: 4.625, maturity: 'Feb-28', bidYield: 4.720, askYield: 4.730, bidPrice: 99.818,  askPrice: 99.799,  modDuration: 1.912,  dv01PerMM: 1912,  change: -2.0 },
  { tenor: '3Y',  label: 'UST 4.375% Feb-29', cusip: '91282CKL0', coupon: 4.375, maturity: 'Feb-29', bidYield: 4.610, askYield: 4.620, bidPrice: 99.337,  askPrice: 99.310,  modDuration: 2.827,  dv01PerMM: 2827,  change: -1.5 },
  { tenor: '5Y',  label: 'UST 4.375% Feb-31', cusip: '91282CKM8', coupon: 4.375, maturity: 'Feb-31', bidYield: 4.470, askYield: 4.480, bidPrice: 99.561,  askPrice: 99.516,  modDuration: 4.487,  dv01PerMM: 4487,  change: -1.0 },
  { tenor: '7Y',  label: 'UST 4.500% Feb-33', cusip: '91282CKN6', coupon: 4.500, maturity: 'Feb-33', bidYield: 4.430, askYield: 4.440, bidPrice: 100.477, askPrice: 100.434, modDuration: 6.051,  dv01PerMM: 6051,  change: -1.5 },
  { tenor: '10Y', label: 'UST 4.250% Feb-36', cusip: '91282CKP1', coupon: 4.250, maturity: 'Feb-36', bidYield: 4.380, askYield: 4.390, bidPrice: 98.872,  askPrice: 98.783,  modDuration: 8.362,  dv01PerMM: 8362,  change: -1.0 },
  { tenor: '20Y', label: 'UST 4.875% Feb-46', cusip: '91282CKQ9', coupon: 4.875, maturity: 'Feb-46', bidYield: 4.560, askYield: 4.570, bidPrice: 102.930, askPrice: 102.840, modDuration: 13.421, dv01PerMM: 13421, change: +0.5 },
  { tenor: '30Y', label: 'UST 4.625% Feb-56', cusip: '91282CKR7', coupon: 4.625, maturity: 'Feb-56', bidYield: 4.610, askYield: 4.620, bidPrice: 100.271, askPrice: 100.180, modDuration: 17.834, dv01PerMM: 17834, change: +1.0 },
]

export const BASE_CORP_BONDS: CorpBond[] = [
  { id: 'jpm-4850-30',  issuer: 'JPMorgan Chase',  description: 'JPM 4.850% Jan-30',  cusip: '46625HJX7', sector: 'Financials',  coupon: 4.850,  maturity: 'Jan-30', ratingMoodys: 'A2',   ratingSP: 'A-',   bidYield: 5.165,  askYield: 5.185,  bidPrice: 100.312, askPrice: 100.156, zSpread: 78,  oas: 72,  modDuration: 4.412,  dv01PerMM: 4412,  change: +0.5, isHY: false },
  { id: 'gs-5150-31',   issuer: 'Goldman Sachs',   description: 'GS 5.150% Feb-31',   cusip: '38141GZQ4', sector: 'Financials',  coupon: 5.150,  maturity: 'Feb-31', ratingMoodys: 'A3',   ratingSP: 'BBB+', bidYield: 5.382,  askYield: 5.402,  bidPrice: 99.125,  askPrice: 98.970,  zSpread: 95,  oas: 89,  modDuration: 4.852,  dv01PerMM: 4852,  change: +1.0, isHY: false },
  { id: 'aapl-3950-32', issuer: 'Apple Inc',       description: 'AAPL 3.950% Aug-32', cusip: '037833DW3', sector: 'Technology',  coupon: 3.950,  maturity: 'Aug-32', ratingMoodys: 'Aaa',  ratingSP: 'AA+',  bidYield: 4.792,  askYield: 4.812,  bidPrice: 97.215,  askPrice: 97.060,  zSpread: 42,  oas: 38,  modDuration: 5.741,  dv01PerMM: 5741,  change: -0.5, isHY: false },
  { id: 'msft-4450-35', issuer: 'Microsoft Corp',  description: 'MSFT 4.450% Nov-35', cusip: '594918BV5', sector: 'Technology',  coupon: 4.450,  maturity: 'Nov-35', ratingMoodys: 'Aaa',  ratingSP: 'AAA',  bidYield: 4.818,  askYield: 4.838,  bidPrice: 98.730,  askPrice: 98.573,  zSpread: 45,  oas: 41,  modDuration: 7.284,  dv01PerMM: 7284,  change: -1.0, isHY: false },
  { id: 'amzn-4600-34', issuer: 'Amazon.com',      description: 'AMZN 4.600% Dec-34', cusip: '023135BF4', sector: 'Technology',  coupon: 4.600,  maturity: 'Dec-34', ratingMoodys: 'A1',   ratingSP: 'AA',   bidYield: 4.945,  askYield: 4.965,  bidPrice: 98.215,  askPrice: 98.058,  zSpread: 57,  oas: 52,  modDuration: 6.891,  dv01PerMM: 6891,  change: +0.5, isHY: false },
  { id: 'bac-5015-33',  issuer: 'Bank of America', description: 'BAC 5.015% Jul-33',  cusip: '06051GJH8', sector: 'Financials',  coupon: 5.015,  maturity: 'Jul-33', ratingMoodys: 'A2',   ratingSP: 'A-',   bidYield: 5.498,  askYield: 5.518,  bidPrice: 97.850,  askPrice: 97.693,  zSpread: 112, oas: 105, modDuration: 6.108,  dv01PerMM: 6108,  change: +1.5, isHY: false },
  { id: 'xom-4227-40',  issuer: 'Exxon Mobil',     description: 'XOM 4.227% Mar-40',  cusip: '30231GAL8', sector: 'Energy',      coupon: 4.227,  maturity: 'Mar-40', ratingMoodys: 'Aa2',  ratingSP: 'AA-',  bidYield: 4.738,  askYield: 4.758,  bidPrice: 96.780,  askPrice: 96.618,  zSpread: 35,  oas: 31,  modDuration: 9.124,  dv01PerMM: 9124,  change: -0.5, isHY: false },
  { id: 'vz-4812-39',   issuer: 'Verizon Comm',    description: 'VZ 4.812% Mar-39',   cusip: '92343VFL4', sector: 'Telecom',     coupon: 4.812,  maturity: 'Mar-39', ratingMoodys: 'Baa1', ratingSP: 'BBB+', bidYield: 5.178,  askYield: 5.198,  bidPrice: 95.430,  askPrice: 95.264,  zSpread: 145, oas: 139, modDuration: 8.653,  dv01PerMM: 8653,  change: +2.0, isHY: false },
  { id: 't-3800-57',    issuer: 'AT&T Inc',         description: 'T 3.800% Dec-57',    cusip: '00206RMN0', sector: 'Telecom',     coupon: 3.800,  maturity: 'Dec-57', ratingMoodys: 'Baa2', ratingSP: 'BBB',  bidYield: 5.395,  askYield: 5.415,  bidPrice: 76.843,  askPrice: 76.677,  zSpread: 172, oas: 167, modDuration: 14.821, dv01PerMM: 14821, change: +1.5, isHY: false },
  { id: 'ba-5805-50',   issuer: 'Boeing Company',   description: 'BA 5.805% May-50',   cusip: '097023CJ4', sector: 'Industrials', coupon: 5.805,  maturity: 'May-50', ratingMoodys: 'Baa2', ratingSP: 'BBB',  bidYield: 6.018,  askYield: 6.038,  bidPrice: 97.215,  askPrice: 97.052,  zSpread: 192, oas: 184, modDuration: 13.241, dv01PerMM: 13241, change: +3.0, isHY: false },
  { id: 'f-5291-30',    issuer: 'Ford Motor',       description: 'F 5.291% Dec-30',    cusip: '345370CQ3', sector: 'Autos',       coupon: 5.291,  maturity: 'Dec-30', ratingMoodys: 'Ba2',  ratingSP: 'BB+',  bidYield: 5.835,  askYield: 5.875,  bidPrice: 97.250,  askPrice: 97.050,  zSpread: 237, oas: 225, modDuration: 4.218,  dv01PerMM: 4218,  change: +2.5, isHY: true  },
  { id: 's-8750-32',    issuer: 'Sprint Capital',   description: 'S 8.750% Mar-32',    cusip: '85207UAD5', sector: 'Telecom',     coupon: 8.750,  maturity: 'Mar-32', ratingMoodys: 'Ba1',  ratingSP: 'BB',   bidYield: 6.812,  askYield: 6.862,  bidPrice: 108.500, askPrice: 108.250, zSpread: 385, oas: 370, modDuration: 4.751,  dv01PerMM: 4751,  change: +3.0, isHY: true  },
  { id: 'ccl-1050-30',  issuer: 'Carnival Corp',    description: 'CCL 10.500% Feb-30', cusip: '143658BN3', sector: 'Leisure',     coupon: 10.500, maturity: 'Feb-30', ratingMoodys: 'B1',   ratingSP: 'B+',   bidYield: 7.225,  askYield: 7.300,  bidPrice: 112.750, askPrice: 112.500, zSpread: 498, oas: 478, modDuration: 3.428,  dv01PerMM: 3428,  change: +4.0, isHY: true  },
  { id: 'tsla-5300-30', issuer: 'Tesla Inc',        description: 'TSLA 5.300% Aug-30', cusip: '88160RAG6', sector: 'Autos',       coupon: 5.300,  maturity: 'Aug-30', ratingMoodys: 'Ba1',  ratingSP: 'BB+',  bidYield: 5.658,  askYield: 5.708,  bidPrice: 98.125,  askPrice: 97.925,  zSpread: 168, oas: 158, modDuration: 4.185,  dv01PerMM: 4185,  change: -1.0, isHY: true  },
  { id: 'bhc-8500-27',  issuer: 'Bausch Health',    description: 'BHC 8.500% Jan-27',  cusip: '071734AE3', sector: 'Healthcare',  coupon: 8.500,  maturity: 'Jan-27', ratingMoodys: 'B3',   ratingSP: 'B-',   bidYield: 10.842, askYield: 10.942, bidPrice: 94.500,  askPrice: 94.000,  zSpread: 785, oas: 758, modDuration: 2.148,  dv01PerMM: 2148,  change: +8.5, isHY: true  },
]

export const BASE_TREASURY_FUTURES: TreasuryFuture[] = [
  { symbol: 'ZT', description: '2-Year Treasury Note',  contract: 'Mar-26', bidPrice: 102.445, askPrice: 102.461, lastPrice: 102.453, change: +0.063, settle: 102.391, high: 102.484, low: 102.313, dv01PerContract: 200,  openInterest: 4_283_421, volume: 312_845, impliedYield: 4.720 },
  { symbol: 'ZF', description: '5-Year Treasury Note',  contract: 'Mar-26', bidPrice: 106.844, askPrice: 106.875, lastPrice: 106.859, change: +0.156, settle: 106.703, high: 106.922, low: 106.594, dv01PerContract: 430,  openInterest: 2_187_362, volume: 198_421, impliedYield: 4.470 },
  { symbol: 'ZN', description: '10-Year Treasury Note', contract: 'Mar-26', bidPrice: 110.734, askPrice: 110.766, lastPrice: 110.750, change: +0.250, settle: 110.500, high: 110.813, low: 110.375, dv01PerContract: 790,  openInterest: 3_521_847, volume: 425_312, impliedYield: 4.380 },
  { symbol: 'ZB', description: '30-Year Treasury Bond', contract: 'Mar-26', bidPrice: 118.906, askPrice: 118.969, lastPrice: 118.938, change: +0.500, settle: 118.438, high: 119.063, low: 118.250, dv01PerContract: 1320, openInterest: 1_284_562, volume: 187_234, impliedYield: 4.610 },
  { symbol: 'UB', description: 'Ultra Treasury Bond',   contract: 'Mar-26', bidPrice: 127.063, askPrice: 127.188, lastPrice: 127.125, change: +0.563, settle: 126.563, high: 127.250, low: 126.875, dv01PerContract: 1785, openInterest: 892_341,   volume: 95_421,  impliedYield: 4.650 },
]

export const BASE_SOFR_FUTURES: SOFRFuture[] = [
  { symbol: 'SFRH6', contract: 'Mar-26', price: 95.130, change: -0.005, impliedRate: 4.870, volume: 312_845, openInterest: 1_284_562 },
  { symbol: 'SFRM6', contract: 'Jun-26', price: 95.250, change: -0.005, impliedRate: 4.750, volume: 245_312, openInterest: 984_231  },
  { symbol: 'SFRU6', contract: 'Sep-26', price: 95.385, change:  0.000, impliedRate: 4.615, volume: 198_421, openInterest: 854_123  },
  { symbol: 'SFRZ6', contract: 'Dec-26', price: 95.500, change: +0.005, impliedRate: 4.500, volume: 165_234, openInterest: 742_845  },
  { symbol: 'SFRH7', contract: 'Mar-27', price: 95.620, change: +0.010, impliedRate: 4.380, volume: 142_312, openInterest: 621_234  },
  { symbol: 'SFRM7', contract: 'Jun-27', price: 95.740, change: +0.010, impliedRate: 4.260, volume: 118_421, openInterest: 512_845  },
  { symbol: 'SFRU7', contract: 'Sep-27', price: 95.850, change: +0.010, impliedRate: 4.150, volume: 94_312,  openInterest: 421_234  },
  { symbol: 'SFRZ7', contract: 'Dec-27', price: 95.950, change: +0.015, impliedRate: 4.050, volume: 78_452,  openInterest: 342_123  },
]

export const BASE_CDX: CDXIndex[] = [
  { name: 'CDX.NA.IG.44',  series: 44, tenor: '5Y',  bidSpread: 64.5,  askSpread: 65.5,  change: +0.75, spreadDuration: 4.82 },
  { name: 'CDX.NA.IG.44',  series: 44, tenor: '10Y', bidSpread: 94.5,  askSpread: 96.0,  change: +0.50, spreadDuration: 8.41 },
  { name: 'CDX.NA.HY.44',  series: 44, tenor: '5Y',  bidSpread: 335.0, askSpread: 342.0, change: +3.50, spreadDuration: 4.21 },
  { name: 'iTraxx Europe',  series: 42, tenor: '5Y',  bidSpread: 77.0,  askSpread: 78.5,  change: +0.25, spreadDuration: 4.75 },
  { name: 'iTraxx Xover',   series: 42, tenor: '5Y',  bidSpread: 312.0, askSpread: 318.0, change: +2.00, spreadDuration: 4.32 },
]

export const BASE_CDS: CDS[] = [
  { name: 'JPMorgan Chase',  ticker: 'JPM',  sector: 'Financials',  ratingMoodys: 'A2',   ratingSP: 'A-',   bid: 51.0,  ask: 54.0,  change: +0.5 },
  { name: 'Goldman Sachs',   ticker: 'GS',   sector: 'Financials',  ratingMoodys: 'A3',   ratingSP: 'BBB+', bid: 66.0,  ask: 70.0,  change: +1.0 },
  { name: 'Bank of America', ticker: 'BAC',  sector: 'Financials',  ratingMoodys: 'A2',   ratingSP: 'A-',   bid: 69.0,  ask: 74.0,  change: +0.5 },
  { name: 'Apple Inc',       ticker: 'AAPL', sector: 'Technology',  ratingMoodys: 'Aaa',  ratingSP: 'AA+',  bid: 28.0,  ask: 32.0,  change: -0.5 },
  { name: 'Ford Motor',      ticker: 'F',    sector: 'Autos',       ratingMoodys: 'Ba2',  ratingSP: 'BB+',  bid: 178.0, ask: 187.0, change: +2.5 },
  { name: 'Tesla Inc',       ticker: 'TSLA', sector: 'Autos',       ratingMoodys: 'Ba1',  ratingSP: 'BB+',  bid: 115.0, ask: 122.0, change: -1.0 },
  { name: 'Boeing Company',  ticker: 'BA',   sector: 'Industrials', ratingMoodys: 'Baa2', ratingSP: 'BBB',  bid: 188.0, ask: 198.0, change: +3.0 },
  { name: 'AT&T Inc',        ticker: 'T',    sector: 'Telecom',     ratingMoodys: 'Baa2', ratingSP: 'BBB',  bid: 128.0, ask: 135.0, change: +1.0 },
]

export const BASE_POSITIONS: Position[] = [
  { id: 'pos-ust10y',  security: 'UST 10Y',      description: 'UST 4.250% Feb-36',      cusip: '91282CKP1', assetClass: 'Treasury',  direction: 'Long',  faceValueMM: 50,  avgPrice: 99.125,  currentPrice: 98.872,  currentYield: 4.380, marketValueMM: 49.44,  modDuration: 8.362,  dv01: 418_100,  cs01: 0,      pnlToday: +12_350, pnlMtd: +48_200,  pnlYtd: +185_400 },
  { id: 'pos-ust5y',   security: 'UST 5Y',        description: 'UST 4.375% Feb-31',      cusip: '91282CKM8', assetClass: 'Treasury',  direction: 'Long',  faceValueMM: 25,  avgPrice: 99.875,  currentPrice: 99.561,  currentYield: 4.470, marketValueMM: 24.89,  modDuration: 4.487,  dv01: 112_175,  cs01: 0,      pnlToday: +8_250,  pnlMtd: +22_450,  pnlYtd: +68_200  },
  { id: 'pos-ust30y',  security: 'UST 30Y',       description: 'UST 4.625% Feb-56',      cusip: '91282CKR7', assetClass: 'Treasury',  direction: 'Short', faceValueMM: 15,  avgPrice: 101.500, currentPrice: 100.271, currentYield: 4.610, marketValueMM: -15.04, modDuration: 17.834, dv01: -267_510, cs01: 0,      pnlToday: +5_820,  pnlMtd: +19_875,  pnlYtd: +42_100  },
  { id: 'pos-jpm30',   security: 'JPM 4.85% 30',  description: 'JPMorgan 4.850% Jan-30', cusip: '46625HJX7', assetClass: 'Corporate', direction: 'Long',  faceValueMM: 30,  avgPrice: 100.875, currentPrice: 100.312, currentYield: 5.165, marketValueMM: 30.09,  modDuration: 4.412,  dv01: 132_360,  cs01: 21_600, pnlToday: -3_180,  pnlMtd: +8_450,   pnlYtd: +28_750  },
  { id: 'pos-aapl32',  security: 'AAPL 3.95% 32', description: 'Apple 3.950% Aug-32',    cusip: '037833DW3', assetClass: 'Corporate', direction: 'Long',  faceValueMM: 20,  avgPrice: 98.250,  currentPrice: 97.215,  currentYield: 4.792, marketValueMM: 19.44,  modDuration: 5.741,  dv01: 114_820,  cs01: 11_482, pnlToday: -2_070,  pnlMtd: +5_280,   pnlYtd: +18_920  },
  { id: 'pos-zn',      security: 'ZN (100 cts)',   description: '10-Year T-Note Future',  cusip: 'CME-ZNH6',  assetClass: 'Future',    direction: 'Short', faceValueMM: 100, avgPrice: 111.250, currentPrice: 110.750, currentYield: 4.380, marketValueMM: 0,      modDuration: 8.1,    dv01: -79_000,  cs01: 0,      pnlToday: +40_000, pnlMtd: +85_250,  pnlYtd: +142_500 },
  { id: 'pos-zb',      security: 'ZB (50 cts)',    description: '30-Year T-Bond Future',  cusip: 'CME-ZBH6',  assetClass: 'Future',    direction: 'Long',  faceValueMM: 50,  avgPrice: 117.500, currentPrice: 118.938, currentYield: 4.610, marketValueMM: 0,      modDuration: 17.2,   dv01: 66_000,   cs01: 0,      pnlToday: +35_750, pnlMtd: +42_180,  pnlYtd: +74_250  },
  { id: 'pos-cdx-ig',  security: 'CDX IG 5Y',      description: 'CDX.NA.IG.44 5Y $50MM', cusip: 'CDX-IG44',  assetClass: 'CDS',       direction: 'Long',  faceValueMM: 50,  avgPrice: 63.00,   currentPrice: 65.00,   currentYield: 0,     marketValueMM: 0,      modDuration: 0,      dv01: 24_100,   cs01: 24_100, pnlToday: -3_750,  pnlMtd: +12_450,  pnlYtd: +31_200  },
]

export const BASE_ORDERS: Order[] = [
  { id: 'ORD-001829', time: '09:32:15', security: 'UST 10Y',      description: 'UST 4.250% Feb-36',      cusip: '91282CKP1', side: 'Buy',  faceValueMM: 25,  limitYield: 4.380, limitPrice: 98.872,  filledMM: 25,  avgFillYield: 4.380, avgFillPrice: 98.872,  status: 'Filled',    account: 'RATES-01',  counterparty: 'JPMORGAN',    venue: 'TradeWeb',     trader: 'T.Chen'  },
  { id: 'ORD-001830', time: '10:15:28', security: 'ZN Short',      description: '10-Year T-Note Future',  cusip: 'CME-ZNH6',  side: 'Sell', faceValueMM: 100, limitYield: null,  limitPrice: 111.250, filledMM: 100, avgFillYield: null,  avgFillPrice: 111.250, status: 'Filled',    account: 'RATES-01',  counterparty: 'CME',         venue: 'CME Globex',   trader: 'T.Chen'  },
  { id: 'ORD-001831', time: '11:42:31', security: 'JPM 4.85% 30',  description: 'JPMorgan 4.850% Jan-30', cusip: '46625HJX7', side: 'Buy',  faceValueMM: 30,  limitYield: 5.165, limitPrice: 100.312, filledMM: 30,  avgFillYield: 5.165, avgFillPrice: 100.312, status: 'Filled',    account: 'CREDIT-01', counterparty: 'BARCLAYS',    venue: 'MarketAxess',  trader: 'S.Patel' },
  { id: 'ORD-001832', time: '12:18:45', security: 'UST 30Y',       description: 'UST 4.625% Feb-56',      cusip: '91282CKR7', side: 'Sell', faceValueMM: 15,  limitYield: 4.610, limitPrice: 100.271, filledMM: 15,  avgFillYield: 4.610, avgFillPrice: 100.271, status: 'Filled',    account: 'RATES-01',  counterparty: 'CITIGROUP',   venue: 'TradeWeb',     trader: 'T.Chen'  },
  { id: 'ORD-001833', time: '13:05:12', security: 'ZB Long',       description: '30-Year T-Bond Future',  cusip: 'CME-ZBH6',  side: 'Buy',  faceValueMM: 50,  limitYield: null,  limitPrice: 117.500, filledMM: 50,  avgFillYield: null,  avgFillPrice: 117.500, status: 'Filled',    account: 'RATES-01',  counterparty: 'CME',         venue: 'CME Globex',   trader: 'T.Chen'  },
  { id: 'ORD-001834', time: '13:52:34', security: 'AAPL 3.95% 32', description: 'Apple 3.950% Aug-32',    cusip: '037833DW3', side: 'Buy',  faceValueMM: 20,  limitYield: 4.792, limitPrice: 97.215,  filledMM: 20,  avgFillYield: 4.792, avgFillPrice: 97.215,  status: 'Filled',    account: 'CREDIT-01', counterparty: 'GOLDMAN',     venue: 'MarketAxess',  trader: 'S.Patel' },
  { id: 'ORD-001835', time: '14:12:15', security: 'CDX IG 5Y',     description: 'CDX.NA.IG.44 5Y',        cusip: 'CDX-IG44',  side: 'Buy',  faceValueMM: 50,  limitYield: null,  limitPrice: 63.00,   filledMM: 50,  avgFillYield: null,  avgFillPrice: 63.00,   status: 'Filled',    account: 'CREDIT-01', counterparty: 'DEUTSCHE',    venue: 'Bloomberg',    trader: 'S.Patel' },
  { id: 'ORD-001836', time: '14:28:42', security: 'UST 5Y',        description: 'UST 4.375% Feb-31',      cusip: '91282CKM8', side: 'Buy',  faceValueMM: 25,  limitYield: 4.470, limitPrice: 99.561,  filledMM: 25,  avgFillYield: 4.470, avgFillPrice: 99.561,  status: 'Filled',    account: 'RATES-01',  counterparty: 'MORGAN STY',  venue: 'TradeWeb',     trader: 'T.Chen'  },
  { id: 'ORD-001837', time: '14:45:18', security: 'UST 10Y',       description: 'UST 4.250% Feb-36',      cusip: '91282CKP1', side: 'Buy',  faceValueMM: 10,  limitYield: 4.385, limitPrice: 98.828,  filledMM: 0,   avgFillYield: null,  avgFillPrice: null,    status: 'Working',   account: 'RATES-01',  counterparty: 'RFQ',         venue: 'TradeWeb',     trader: 'T.Chen'  },
  { id: 'ORD-001838', time: '14:47:03', security: 'F 5.291% 30',   description: 'Ford 5.291% Dec-30',     cusip: '345370CQ3', side: 'Buy',  faceValueMM: 5,   limitYield: 5.835, limitPrice: 97.250,  filledMM: 2,   avgFillYield: 5.838, avgFillPrice: 97.234,  status: 'Partial',   account: 'CREDIT-01', counterparty: 'BARCLAYS',    venue: 'MarketAxess',  trader: 'S.Patel' },
  { id: 'ORD-001839', time: '14:51:22', security: 'AAPL 3.95% 32', description: 'Apple 3.950% Aug-32',    cusip: '037833DW3', side: 'Buy',  faceValueMM: 5,   limitYield: 4.792, limitPrice: 97.215,  filledMM: 0,   avgFillYield: null,  avgFillPrice: null,    status: 'Working',   account: 'CREDIT-01', counterparty: 'RFQ',         venue: 'MarketAxess',  trader: 'S.Patel' },
  { id: 'ORD-001840', time: '14:53:45', security: 'ZN Long',       description: '10-Year T-Note Future',  cusip: 'CME-ZNH6',  side: 'Buy',  faceValueMM: 25,  limitYield: null,  limitPrice: 110.750, filledMM: 0,   avgFillYield: null,  avgFillPrice: null,    status: 'Cancelled', account: 'RATES-01',  counterparty: 'CME',         venue: 'CME Globex',   trader: 'T.Chen'  },
]

// ─── Perturbation helpers ─────────────────────────────────────────────────────

function perturbYield(y: number, level: number, slope: number, slopeFactor: number): number {
  return Math.round((y + level + slope * slopeFactor) * 10000) / 10000
}

function yieldToPrice(prevYield: number, newYield: number, prevPrice: number, modDur: number): number {
  const dY = (newYield - prevYield) / 100
  return Math.round((prevPrice - modDur * dY * prevPrice) * 10000) / 10000
}

// ─── Angular Service ──────────────────────────────────────────────────────────

const SLOPE_FACTORS = [2, 1.5, 1, 0.5, 0, -0.5, -0.5, -0.5, -0.5, 0, 0]

@Injectable({ providedIn: 'root' })
export class MarketDataService {
  private _treasuries$ = new BehaviorSubject<Treasury[]>(BASE_TREASURIES.map(t => ({ ...t })))
  private _corpBonds$  = new BehaviorSubject<CorpBond[]>(BASE_CORP_BONDS.map(b => ({ ...b })))
  private _tFutures$   = new BehaviorSubject<TreasuryFuture[]>(BASE_TREASURY_FUTURES.map(f => ({ ...f })))
  private _sofrFutures$= new BehaviorSubject<SOFRFuture[]>(BASE_SOFR_FUTURES.map(f => ({ ...f })))
  private _cdxIndices$ = new BehaviorSubject<CDXIndex[]>(BASE_CDX.map(c => ({ ...c })))
  private _cdsNames$   = new BehaviorSubject<CDS[]>(BASE_CDS.map(c => ({ ...c })))
  private _yieldCurve$ = new BehaviorSubject<YieldCurvePoint[]>(BASE_YIELD_CURVE.map(p => ({ ...p })))
  private _orders$     = new BehaviorSubject<Order[]>(BASE_ORDERS.map(o => ({ ...o })))
  private _positions$  = new BehaviorSubject<Position[]>(BASE_POSITIONS.map(p => ({ ...p })))

  readonly treasuries$  = this._treasuries$.asObservable()
  readonly corpBonds$   = this._corpBonds$.asObservable()
  readonly tFutures$    = this._tFutures$.asObservable()
  readonly sofrFutures$ = this._sofrFutures$.asObservable()
  readonly cdxIndices$  = this._cdxIndices$.asObservable()
  readonly cdsNames$    = this._cdsNames$.asObservable()
  readonly yieldCurve$  = this._yieldCurve$.asObservable()
  readonly orders$      = this._orders$.asObservable()
  readonly positions$   = this._positions$.asObservable()

  private intervalId: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.intervalId = setInterval(() => this.tick(), 2500)
  }

  private tick(): void {
    const level = (Math.random() - 0.5) * 0.015
    const slope = (Math.random() - 0.5) * 0.008

    // Treasuries
    const prevTreasuries = this._treasuries$.getValue()
    this._treasuries$.next(prevTreasuries.map((t, i) => {
      const sf = SLOPE_FACTORS[i] ?? 0
      const newBidYield = perturbYield(t.bidYield, level, slope, sf)
      const newAskYield = perturbYield(t.askYield, level, slope, sf)
      const newBidPrice = yieldToPrice(t.bidYield, newBidYield, t.bidPrice, t.modDuration)
      const newAskPrice = yieldToPrice(t.askYield, newAskYield, t.askPrice, t.modDuration)
      return { ...t, bidYield: newBidYield, askYield: newAskYield, bidPrice: newBidPrice, askPrice: newAskPrice }
    }))

    // Yield curve
    const prevCurve = this._yieldCurve$.getValue()
    this._yieldCurve$.next(prevCurve.map((pt, i) => ({
      ...pt,
      yield: Math.round((pt.yield + level + slope * (SLOPE_FACTORS[i] ?? 0)) * 10000) / 10000
    })))

    // Corp bonds
    const prevBonds = this._corpBonds$.getValue()
    this._corpBonds$.next(prevBonds.map(b => {
      const creditNoise = (Math.random() - 0.5) * 0.008
      const newBidYield = Math.round((b.bidYield + level + creditNoise) * 10000) / 10000
      const newAskYield = Math.round((b.askYield + level + creditNoise) * 10000) / 10000
      const newBidPrice = yieldToPrice(b.bidYield, newBidYield, b.bidPrice, b.modDuration)
      const newAskPrice = yieldToPrice(b.askYield, newAskYield, b.askPrice, b.modDuration)
      const newZSpread  = Math.round((b.zSpread - creditNoise * 100) * 10) / 10
      return { ...b, bidYield: newBidYield, askYield: newAskYield, bidPrice: newBidPrice, askPrice: newAskPrice, zSpread: newZSpread }
    }))

    // Treasury futures
    const prevTF = this._tFutures$.getValue()
    this._tFutures$.next(prevTF.map(f => {
      const priceMove = -level / 100 * f.dv01PerContract * 100 / 1000
      const newLast = Math.round((f.lastPrice + priceMove) * 10000) / 10000
      return { ...f, lastPrice: newLast, bidPrice: newLast - 0.016, askPrice: newLast + 0.016 }
    }))

    // SOFR futures
    const prevSF = this._sofrFutures$.getValue()
    this._sofrFutures$.next(prevSF.map((f, i) => {
      const fwdNoise = (Math.random() - 0.5) * 0.003
      const newPrice = Math.round((f.price - level - fwdNoise * (i * 0.1)) * 10000) / 10000
      return { ...f, price: newPrice, impliedRate: Math.round((100 - newPrice) * 10000) / 10000 }
    }))

    // CDX indices
    const prevCDX = this._cdxIndices$.getValue()
    this._cdxIndices$.next(prevCDX.map(c => {
      const creditMove = (Math.random() - 0.5) * 0.3
      return { ...c, bidSpread: Math.round((c.bidSpread + creditMove) * 100) / 100, askSpread: Math.round((c.askSpread + creditMove) * 100) / 100 }
    }))

    // CDS names
    const prevCDS = this._cdsNames$.getValue()
    this._cdsNames$.next(prevCDS.map(c => {
      const move = (Math.random() - 0.5) * 0.5
      return { ...c, bid: Math.round((c.bid + move) * 10) / 10, ask: Math.round((c.ask + move) * 10) / 10 }
    }))
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId)
  }
}
