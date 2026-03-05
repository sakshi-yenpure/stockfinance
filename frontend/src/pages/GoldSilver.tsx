import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchLiveMetalsPrices, 
  subscribeToMetalsUpdates, 
  MetalsData, 
  MetalPrice,
  ChartData
} from '../services/metalsApi';
import { getStaticHistoricalData } from '../services/staticHistoricalData';
import CorrelationChart from '../components/CorrelationChart';
import PriceTrendChart from '../components/PriceTrendChart';

const GoldSilverContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const PageTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #ffd700, #c0c0c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MetalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const MetalCard = styled(motion.div)<{ glowcolor?: string }>`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.glowcolor ? `0 0 20px ${props.glowcolor}40` : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }
`;

const MetalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetalIcon = styled.div`
  font-size: 3rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
`;

const MetalName = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0;
`;

const LiveIndicator = styled(motion.div)`
  background: linear-gradient(45deg, #ff4757, #ff6b81);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`;

const PriceContainer = styled(motion.div)`
  margin-bottom: 1rem;
`;

const PriceText = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
`;

const PriceChange = styled.div<{ positive: boolean }>`
  color: ${props => props.positive ? '#00b894' : '#ff6b6b'};
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const MiniChart = styled.div`
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
`;

const ChartLine = styled(motion.div)<{ positive: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: ${props => props.positive 
    ? 'linear-gradient(90deg, transparent, #00b894, transparent)' 
    : 'linear-gradient(90deg, transparent, #ff6b6b, transparent)'
  };
`;

const LastUpdated = styled.div`
  color: #888;
  font-size: 0.8rem;
  margin-top: 1rem;
`;

const LoadingSkeleton = styled.div`
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  height: 2rem;
  margin: 0.5rem 0;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: #ff6b6b;
  margin: 1rem 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FullWidthChart = styled.div`
  grid-column: 1 / -1;
`;

const GoldSilver: React.FC = () => {
  const [metalsData, setMetalsData] = useState<MetalsData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fallback chart data to ensure charts always display something
  const fallbackChartData: ChartData = {
    goldHistory: [{ date: '2024-01-01', price: 1800 }, { date: '2024-01-02', price: 1820 }],
    silverHistory: [{ date: '2024-01-01', price: 22.5 }, { date: '2024-01-02', price: 23.1 }],
    correlation: {
      goldPrices: [1800, 1820],
      silverPrices: [22.5, 23.1],
      dates: ['2024-01-01', '2024-01-02'],
      correlation: 0.95,
      rSquared: 0.9025,
      regressionSlope: 0.5,
      regressionIntercept: 900
    },
    lastUpdated: new Date().toISOString()
  };
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const unsubscribe = subscribeToMetalsUpdates(
      (data) => {
        setMetalsData(data);
        setLoading(false);
        setError(null);
        setLastUpdate(new Date());
      },
      30000 // 30 seconds refresh
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadChartsData = () => {
      setChartsLoading(true);
      
      // Use static historical data instead of API
      const historicalData = getStaticHistoricalData();
      
      console.log('Static historical data loaded:', {
        goldHistoryLength: historicalData.goldHistory.length,
        silverHistoryLength: historicalData.silverHistory.length,
        correlation: historicalData.correlation.correlation,
        sampleSize: historicalData.correlation.goldPrices.length
      });
      
      setChartData(historicalData);
      setChartsLoading(false);
    };

    loadChartsData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number) => {
    return change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  };

  const formatPercent = (percent: number) => {
    return percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const renderMetalCard = (metal: MetalPrice, icon: string, name: string) => {
    const isPositive = metal.change >= 0;
    const glowColor = isPositive ? '#00b894' : '#ff6b6b';

    return (
      <MetalCard
        key={name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        glowcolor={glowColor}
      >
        <MetalHeader>
          <MetalIcon>{icon}</MetalIcon>
          <MetalName>{name}</MetalName>
          <LiveIndicator
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ● Live
          </LiveIndicator>
        </MetalHeader>

        <PriceContainer
          key={`${metal.price}-${metal.change}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <PriceText>{formatPrice(metal.price)}</PriceText>
          <PriceChange positive={isPositive}>
            {formatChange(metal.change)} ({formatPercent(metal.changePercent)})
            {isPositive ? ' 📈' : ' 📉'}
          </PriceChange>
        </PriceContainer>

        <MiniChart>
          <ChartLine
            positive={isPositive}
            animate={{ 
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </MiniChart>

        <LastUpdated>
          Updated: {formatTime(new Date(metal.lastUpdated))}
        </LastUpdated>
      </MetalCard>
    );
  };

  const renderLoadingSkeleton = () => (
    <>
      {['Gold', 'Silver'].map((metal) => (
        <MetalCard key={metal}>
          <MetalHeader>
            <MetalIcon>{metal === 'Gold' ? '🥇' : '🥈'}</MetalIcon>
            <MetalName>{metal}</MetalName>
            <LiveIndicator>● Live</LiveIndicator>
          </MetalHeader>
          
          <LoadingSkeleton style={{ height: '3rem', width: '60%', margin: '0 auto' }} />
          <LoadingSkeleton style={{ height: '1.5rem', width: '40%', margin: '0.5rem auto' }} />
          <LoadingSkeleton style={{ height: '2rem', width: '80%', margin: '1rem auto' }} />
          <LoadingSkeleton style={{ height: '1rem', width: '50%', margin: '1rem auto' }} />
        </MetalCard>
      ))}
    </>
  );

  return (
    <GoldSilverContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Live Precious Metals
      </PageTitle>

      {error && (
        <ErrorMessage>
          ⚠️ {error}. Showing demo data with random variations.
        </ErrorMessage>
      )}

      <MetalsGrid>
        <AnimatePresence mode="wait">
          {loading ? renderLoadingSkeleton() : (
            <>
              {metalsData && renderMetalCard(metalsData.gold, '🥇', 'Gold')}
              {metalsData && renderMetalCard(metalsData.silver, '🥈', 'Silver')}
            </>
          )}
        </AnimatePresence>
      </MetalsGrid>

      <motion.div
        style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Data refreshes every 30 seconds</p>
        <p>Last check: {formatTime(lastUpdate)}</p>
      </motion.div>

      {/* Historical Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 style={{ 
          textAlign: 'center', 
          color: '#ffffff', 
          margin: '3rem 0 2rem 0',
          fontSize: '2rem',
          background: 'linear-gradient(45deg, #4ecdc4, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📈 Historical Analysis
        </h2>

        {chartsLoading ? (
          <div style={{ textAlign: 'center', color: '#888', margin: '2rem 0' }}>
            Loading historical data...
          </div>
        ) : (
          <ChartsGrid>
            {/* Correlation Chart */}
            <FullWidthChart>
              <CorrelationChart data={chartData?.correlation || fallbackChartData.correlation} />
            </FullWidthChart>

            {/* Gold Trend Chart */}
            <PriceTrendChart
              data={chartData?.goldHistory || fallbackChartData.goldHistory}
              title="Gold"
              icon="🥇"
              color="#ffd700"
              height={350}
            />

            {/* Silver Trend Chart */}
            <PriceTrendChart
              data={chartData?.silverHistory || fallbackChartData.silverHistory}
              title="Silver"
              icon="🥈"
              color="#c0c0c0"
              height={350}
            />
          </ChartsGrid>
        )}
      </motion.div>
    </GoldSilverContainer>
  );
};

export default GoldSilver;