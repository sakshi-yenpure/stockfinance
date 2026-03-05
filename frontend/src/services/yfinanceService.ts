// yFinance Service for Indian Stock Data (NSE/BSE)
// Now uses backend APIs to fetch data from yfinance

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface StockData {
  symbol: string;
  name: string;
  // canonical fields (may be absent for mock data)
  currentPrice?: number;
  previousClose?: number;
  change?: number;
  changePercent?: number;
  dayLow?: number;
  dayHigh?: number;
  peRatio?: number;
  marketCap?: number;
  eps?: number;
  volume?: number;
  sector?: string;
  industry?: string;

  // UI-friendly aliases used across components (optional)
  price?: number;
  min?: number;
  max?: number;
  pe?: number;
  mcv?: number; // market cap in Crores (approx)
  opportunity?: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

// Common Indian stock symbols by sector
const indianSectorSymbols = {
  automobile: [
    'TATAMOTORS.NS', 'M&M.NS', 'MARUTI.NS', 'BAJAJ-AUTO.NS', 'HEROMOTOCO.NS',
    'ASHOKLEY.NS', 'EICHERMOT.NS', 'TVSMOTOR.NS', 'BOSCHLTD.NS', 'MOTHERSUMI.NS',
    'FORCEMOTORS.NS', 'CUMMINSIND.NS'
  ],
  it: [
    'INFY.NS', 'TCS.NS', 'HCLTECH.NS', 'WIPRO.NS', 'TECHM.NS',
    'MINDTREE.NS', 'MPHASIS.NS', 'PERSISTENT.NS', 'COFORGE.NS',
    'LTTS.NS', 'CDSL.NS', 'KPITTECH.NS', 'ELCL.NS'
  ],
  hospitality: [
    'INDHOTEL.NS', 'EIHOTEL.NS', 'TAJGVK.NS', 'CHALET.NS', 'LUXIND.NS',
    'APOLLOHOTEL.NS'
  ],
  finance: [
    'BAJFINANCE.NS', 'HDFC.NS', 'BAJAJFINSV.NS', 'CHOLAFIN.NS', 'SBIFIN.NS',
    'PFC.NS', 'RECLTD.NS', 'MUTHOOTFIN.NS', 'IIFL.NS', 'LICHSGFIN.NS'
  ],
  banking: [
    'HDFCBANK.NS', 'ICICIBANK.NS', 'SBIN.NS', 'KOTAKBANK.NS', 'AXISBANK.NS',
    'INDUSINDBK.NS', 'BANDHANBNK.NS', 'FEDERALBNK.NS', 'YESBANK.NS', 'IDFCFIRSTB.NS',
    'AUBANK.NS', 'UTTAMSTEEL.NS'
  ],
  energy: [
    'RELIANCE.NS', 'NTPC.NS', 'POWERGRID.NS', 'TORNTPOWER.NS', 'JSW.NS',
    'ADANIPOWER.NS', 'INDIGO.NS', 'OIL.NS', 'BPCL.NS', 'HPCL.NS'
  ],
  pharma: [
    'SUNPHARMA.NS', 'CIPLA.NS', 'DRHP.NS', 'AUROPHARMA.NS', 'LUPIN.NS',
    'BIOCON.NS', 'GLENMARK.NS', 'DIVISLAB.NS', 'CDSL.NS', 'ALKEM.NS'
  ],
  fmcg: [
    'NESTLEIND.NS', 'BRITANNIA.NS', 'MARICO.NS', 'HINDUNILVR.NS', 'GODREJCP.NS',
    'COLPAL.NS', 'BARBEQUE.NS', 'PRATAGRP.NS'
  ],
  metals: [
    'TATASTEEL.NS', 'HINDALCO.NS', 'JSWSTEEL.NS', 'NATIONALUM.NS', 'JINDALSTEL.NS',
    'VEDL.NS'
  ],
  realty: [
    'DLF.NS', 'INDIABULLS.NS', 'OBEROI.NS', 'GPIL.NS', 'SUNTECK.NS',
    'LODHA.NS'
  ]
};

export const yfinanceService = {
  // Get sector stocks with full data
  async getSectorStocks(sector: string): Promise<StockData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/stocks/sector/${sector.toLowerCase()}/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${sector} sector data`);
      }
      
      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('Invalid response format');
      }
      
      // Transform API response to StockData format
      return result.data.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.currentPrice,
        previousClose: stock.currentPrice - stock.change,
        change: stock.change,
        changePercent: stock.changePercent,
        dayLow: stock.dayLow,
        dayHigh: stock.dayHigh,
        peRatio: stock.peRatio,
        marketCap: stock.marketCap,
        volume: stock.volume,
        
        // UI aliases
        price: stock.currentPrice,
        min: stock.dayLow,
        max: stock.dayHigh,
        pe: stock.peRatio,
        mcv: stock.marketCap ? Math.round(stock.marketCap / 10000000) : 0,
        opportunity: getOpportunityRating({
          peRatio: stock.peRatio,
          changePercent: stock.changePercent
        })
      }));
    } catch (error) {
      console.error(`Sector ${sector} data error:`, error);
      throw new Error(`Failed to fetch ${sector} sector data`);
    }
  }
  
};

// Helper function to determine opportunity rating
const getOpportunityRating = (stock: any): string => {
  const pe = stock.peRatio || stock.pe;
  const growthPotential = stock.changePercent ?? 0;

  if (pe && pe < 15 && growthPotential > 2) return 'Buy';
  if (pe && pe > 30 && growthPotential < 0) return 'Sell';
  if (pe && pe > 25 && growthPotential < 1) return 'Sell';
  if (pe && pe < 20 && growthPotential > 1) return 'Buy';

  return 'Hold';
};

// Utility function to format currency for Indian market
const formatIndianCurrency = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
};

// Utility function to format large numbers
const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
};

export { formatIndianCurrency, formatLargeNumber };