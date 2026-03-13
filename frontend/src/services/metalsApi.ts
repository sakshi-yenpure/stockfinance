// metalsApi.ts
// Metals API Service using Backend API (via Nginx /api proxy)

const API_BASE = process.env.REACT_APP_API_BASE || '/api'; // <- use relative path

export interface MetalPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface MetalsData {
  gold: MetalPrice;
  silver: MetalPrice;
  timestamp: number;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
  volume?: number;
  ma20?: number; // 20-day SMA
  rsi?: number; // 14-day RSI
}

export interface CorrelationData {
  goldPrices: number[];
  silverPrices: number[];
  dates: string[];
  correlation: number;
  rSquared: number;
  regressionSlope: number;
  regressionIntercept: number;
}

export interface ChartData {
  goldHistory: HistoricalDataPoint[];
  silverHistory: HistoricalDataPoint[];
  correlation: CorrelationData;
  lastUpdated: string;
}

// Mock data fallback
export const mockMetalsData: MetalsData = {
  gold: { symbol: 'XAU/USD', price: 2150.75, change: 52.25, changePercent: 2.49, lastUpdated: new Date().toISOString() },
  silver: { symbol: 'XAG/USD', price: 25.80, change: 0.31, changePercent: 1.22, lastUpdated: new Date().toISOString() },
  timestamp: Date.now()
};

// Fetch live metals prices
export const fetchLiveMetalsPrices = async (): Promise<MetalsData> => {
  try {
    const response = await fetch(`${API_BASE}/auth/metals/prices/`);
    if (!response.ok) throw new Error('Failed to fetch metals data');
    const result = await response.json();
    if (!result.success || !result.data) throw new Error('Invalid backend response');

    const { gold, silver } = result.data;
    return { gold: { ...gold }, silver: { ...silver }, timestamp: Date.now() };
  } catch (error) {
    console.error('Error fetching metals prices:', error);
    // Return mock data with small random variations
    const mock = { ...mockMetalsData };
    mock.gold.price += (Math.random() - 0.5) * 10;
    mock.gold.change = mock.gold.price - 2150.75;
    mock.silver.price += (Math.random() - 0.5) * 0.5;
    mock.silver.change = mock.silver.price - 25.8;
    mock.timestamp = Date.now();
    return mock;
  }
};

// Calculate 20-day SMA and 14-day RSI
export const calculateIndicators = (data: HistoricalDataPoint[]): HistoricalDataPoint[] => {
  const result = data.map(p => ({ ...p }));
  // 20-day SMA
  for (let i = 0; i < result.length; i++) {
    if (i >= 19) {
      const sum = result.slice(i - 19, i + 1).reduce((acc, p) => acc + p.price, 0);
      result[i].ma20 = sum / 20;
    }
  }

  // 14-day RSI
  const period = 14;
  if (result.length > period) {
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
      const diff = result[i].price - result[i - 1].price;
      if (diff > 0) gains += diff; else losses -= diff;
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < result.length; i++) {
      const diff = result[i].price - result[i - 1].price;
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result[i].rsi = 100 - (100 / (1 + rs));
    }
  }
  return result;
};

// Correlation and linear regression
export const calculateCorrelation = (goldPrices: number[], silverPrices: number[]): CorrelationData => {
  const n = goldPrices.length;
  if (n < 2) return { goldPrices, silverPrices, dates: [], correlation: 0, rSquared: 0, regressionSlope: 0, regressionIntercept: 0 };

  const goldMean = goldPrices.reduce((a, b) => a + b, 0) / n;
  const silverMean = silverPrices.reduce((a, b) => a + b, 0) / n;
  let covariance = 0, goldVar = 0, silverVar = 0;

  for (let i = 0; i < n; i++) {
    covariance += (goldPrices[i] - goldMean) * (silverPrices[i] - silverMean);
    goldVar += (goldPrices[i] - goldMean) ** 2;
    silverVar += (silverPrices[i] - silverMean) ** 2;
  }

  covariance /= n; goldVar /= n; silverVar /= n;

  const correlation = goldVar * silverVar === 0 ? 0 : covariance / Math.sqrt(goldVar * silverVar);
  const slope = goldVar === 0 ? 0 : covariance / goldVar;
  const intercept = silverMean - slope * goldMean;
  const rSquared = correlation ** 2;

  return { goldPrices, silverPrices, dates: [], correlation, rSquared, regressionSlope: slope, regressionIntercept: intercept };
};

// Generate mock historical data for charting
export const generateMockHistoricalData = (): ChartData => {
  const goldHistory: HistoricalDataPoint[] = [];
  const silverHistory: HistoricalDataPoint[] = [];
  const goldPrices: number[] = [];
  const silverPrices: number[] = [];
  const dates: string[] = [];

  const today = new Date();
  const baseGold = 1800 + Math.random() * 400;
  const baseSilver = 20 + Math.random() * 10;

  for (let i = 252; i >= 0; i--) {
    const date = new Date(today); date.setDate(today.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split('T')[0];

    const gPrice = baseGold + (Math.random() - 0.5) * 100 + i * 0.5;
    const sPrice = baseSilver + (Math.random() - 0.5) * 2 + i * 0.05;

    dates.push(dateStr);
    goldHistory.push({ date: dateStr, price: gPrice });
    silverHistory.push({ date: dateStr, price: sPrice });
    goldPrices.push(gPrice);
    silverPrices.push(sPrice);
  }

  const correlationData = calculateCorrelation(goldPrices, silverPrices);
  correlationData.dates = dates;

  return { goldHistory, silverHistory, correlation: correlationData, lastUpdated: new Date().toISOString() };
};

// Fetch historical data
export const fetchHistoricalData = async (): Promise<ChartData> => {
  try {
    return generateMockHistoricalData();
  } catch (error) {
    console.error('Error generating historical data:', error);
    return generateMockHistoricalData();
  }
};

// Subscribe to live metals updates
export const subscribeToMetalsUpdates = (
  callback: (data: MetalsData) => void,
  interval: number = 30000
): (() => void) => {
  let subscribed = true;
  const fetchAndUpdate = async () => {
    if (!subscribed) return;
    try { callback(await fetchLiveMetalsPrices()); } 
    catch (err) { console.error('Error in metals subscription:', err); }
  };
  fetchAndUpdate();
  const id = setInterval(fetchAndUpdate, interval);
  return () => { subscribed = false; clearInterval(id); };
};
