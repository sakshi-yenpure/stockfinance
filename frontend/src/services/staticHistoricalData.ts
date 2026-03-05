import { ChartData, CorrelationData } from './metalsApi';
import { goldHistoricalData } from '../data/goldHistoricalData';
import { silverHistoricalData } from '../data/silverHistoricalData';
import { calculateCorrelation } from './metalsApi';

// Get static historical data for charts
export const getStaticHistoricalData = (): ChartData => {
  // Extract prices for correlation calculation
  const goldPrices = goldHistoricalData.map(item => item.price);
  const silverPrices = silverHistoricalData.map(item => item.price);
  const dates = goldHistoricalData.map(item => item.date);
  
  // Calculate correlation and regression
  const correlationData = calculateCorrelation(goldPrices, silverPrices);
  correlationData.dates = dates;
  
  return {
    goldHistory: goldHistoricalData,
    silverHistory: silverHistoricalData,
    correlation: correlationData,
    lastUpdated: new Date().toISOString()
  };
};

// Calculate statistics for display
export const getHistoricalStats = () => {
  const data = getStaticHistoricalData();
  
  return {
    goldPrices: data.correlation.goldPrices,
    silverPrices: data.correlation.silverPrices,
    correlation: data.correlation.correlation,
    rSquared: data.correlation.rSquared,
    regressionSlope: data.correlation.regressionSlope,
    regressionIntercept: data.correlation.regressionIntercept,
    sampleSize: data.correlation.goldPrices.length
  };
};