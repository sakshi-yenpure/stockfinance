import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchLiveMetalsPrices, 
  subscribeToMetalsUpdates, 
  MetalsData, 
  MetalPrice, 
  ChartData,
  calculateIndicators
} from '../services/metalsApi';
import { getStaticHistoricalData } from '../services/staticHistoricalData';
import CorrelationChart from '../components/CorrelationChart';
import PriceTrendChart from '../components/PriceTrendChart';
import MetalsPredictionChart from '../components/MetalsPredictionChart';
import MonthlyPredictionTable from '../components/MonthlyPredictionTable';

const GoldSilverContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  background: ${props => props.theme.colors.accentPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LiveSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const MetalCard = styled(motion.div)<{ positive: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 3rem;
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: ${props => props.positive ? props.theme.colors.success : props.theme.colors.danger};
  }
`;

const MetalIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
`;

const MetalName = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 800;
`;

const PriceText = styled.div`
  font-size: 4.5rem;
  font-weight: 900;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 1rem;
  letter-spacing: -2px;
`;

const PriceChange = styled.div<{ positive: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
`;

const LiveBadge = styled(motion.div)`
  background: #ff4757;
  color: white;
  padding: 0.4rem 1.2rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const PredictionTableContainer = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 4rem;
`;

const TableTitle = styled.h2`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1.5rem;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  th {
    color: ${props => props.theme.colors.textSecondary};
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
  }
  
  td {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const UpDown = styled.span<{ positive: boolean }>`
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.danger};
`;

const GoldSilver: React.FC = () => {
  const [metalsData, setMetalsData] = useState<MetalsData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const unsubscribe = subscribeToMetalsUpdates(
      (data) => {
        setMetalsData(data);
        setLoading(false);
        setLastUpdate(new Date());
      },
      30000
    );

    const loadCharts = () => {
      setChartsLoading(true);
      const data = getStaticHistoricalData();
      data.goldHistory = calculateIndicators(data.goldHistory);
      data.silverHistory = calculateIndicators(data.silverHistory);
      setChartData(data);
      setChartsLoading(false);
    };

    loadCharts();
    return unsubscribe;
  }, []);

  const formatCurrency = (val: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(val);
  };

  const getPredictionData = (history: any[]) => {
    if (!history || history.length < 5) return { price: 0, change: 0, direction: 'up' };
    const last = history[history.length - 1].price;
    const prev = history[history.length - 5].price;
    const predicted = last + (last - prev) / 2;
    return {
      price: predicted,
      change: ((predicted - last) / last) * 100,
      direction: predicted >= last ? 'up' : 'down'
    };
  };

  const goldPred = getPredictionData(chartData?.goldHistory || []);
  const silverPred = getPredictionData(chartData?.silverHistory || []);

  return (
    <GoldSilverContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Live Precious Metals
      </PageTitle>

      <LiveSection>
        {loading ? (
          <div>Loading prices...</div>
        ) : metalsData && (
          <>
            <MetalCard 
              positive={metalsData.gold.change >= 0}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <LiveBadge
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ● LIVE
              </LiveBadge>
              <MetalIcon>💰</MetalIcon>
              <MetalName>Gold (XAU/USD)</MetalName>
              <PriceText>{formatCurrency(metalsData.gold.price)}</PriceText>
              <PriceChange positive={metalsData.gold.change >= 0}>
                {metalsData.gold.change >= 0 ? '+' : ''}{metalsData.gold.change.toFixed(2)} 
                ({metalsData.gold.changePercent.toFixed(2)}%)
                {metalsData.gold.change >= 0 ? ' 📈' : ' 📉'}
              </PriceChange>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </MetalCard>

            <MetalCard 
              positive={metalsData.silver.change >= 0}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <LiveBadge
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ● LIVE
              </LiveBadge>
              <MetalIcon>🥈</MetalIcon>
              <MetalName>Silver (XAG/USD)</MetalName>
              <PriceText>{formatCurrency(metalsData.silver.price, 4)}</PriceText>
              <PriceChange positive={metalsData.silver.change >= 0}>
                {metalsData.silver.change >= 0 ? '+' : ''}{metalsData.silver.change.toFixed(4)} 
                ({metalsData.silver.changePercent.toFixed(2)}%)
                {metalsData.silver.change >= 0 ? ' 📈' : ' 📉'}
              </PriceChange>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </MetalCard>
          </>
        )}
      </LiveSection>

      <PredictionTableContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TableTitle>🔮 Market Predictions (15 Days)</TableTitle>
        <StyledTable>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Current Price</th>
              <th>Target Price</th>
              <th>Exp. Growth</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gold (XAU)</td>
              <td>{formatCurrency(metalsData?.gold.price || 0)}</td>
              <td>{formatCurrency(goldPred.price)}</td>
              <td>
                <UpDown positive={goldPred.change >= 0}>
                  {goldPred.change >= 0 ? '+' : ''}{goldPred.change.toFixed(2)}%
                </UpDown>
              </td>
              <td>{goldPred.direction === 'up' ? '🚀 Bullish' : '📉 Bearish'}</td>
            </tr>
            <tr>
              <td>Silver (XAG)</td>
              <td>{formatCurrency(metalsData?.silver.price || 0, 4)}</td>
              <td>{formatCurrency(silverPred.price, 4)}</td>
              <td>
                <UpDown positive={silverPred.change >= 0}>
                  {silverPred.change >= 0 ? '+' : ''}{silverPred.change.toFixed(2)}%
                </UpDown>
              </td>
              <td>{silverPred.direction === 'up' ? '🚀 Bullish' : '📉 Bearish'}</td>
            </tr>
          </tbody>
        </StyledTable>
      </PredictionTableContainer>

      <MonthlyPredictionTable />

      {!chartsLoading && chartData && (
        <div style={{ display: 'grid', gap: '3rem' }}>
          <PriceTrendChart 
            data={chartData.goldHistory} 
            title="Gold" 
            color="#FFD700" 
            icon="💰"
            height={400}
          />
          <PriceTrendChart 
            data={chartData.silverHistory} 
            title="Silver" 
            color="#c0c0c0" 
            icon="🥈"
            height={400}
          />
          <CorrelationChart data={chartData.correlation} />
        </div>
      )}
    </GoldSilverContainer>
  );
};

export default GoldSilver;