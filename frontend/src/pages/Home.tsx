import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { fetchLiveMetalsPrices, MetalsData } from '../services/metalsApi';
import { yfinanceService, StockData } from '../services/yfinanceService';
import PriceTrendChart from '../components/PriceTrendChart';
import { getStaticHistoricalData } from '../services/staticHistoricalData';

const HomeContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled(motion.section)`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainCard = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(10px);
`;

const SidebarCard = styled(MainCard)`
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
`;

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MarketItem = styled(motion.div)<{ positive: boolean }>`
  background: rgba(255, 255, 255, 0.03);
  padding: 1.2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.positive ? props.theme.colors.success : props.theme.colors.danger};
  
  h4 {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
  
  .price {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
  }
  
  .change {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.danger};
  }
`;

const NewsItem = styled(Link)`
  display: block;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    transform: translateX(5px);
    
    h4 {
      color: #4facfe;
    }
  }
  
  h4 {
    font-size: 1rem;
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: 0.4rem;
    line-height: 1.4;
  }
  
  span {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FeaturedStock = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .info {
    display: flex;
    flex-direction: column;
    .symbol { font-weight: 700; }
    .name { font-size: 0.8rem; color: ${props => props.theme.colors.textSecondary}; }
  }
  
  .values {
    text-align: right;
    .price { font-weight: 700; }
    .change { font-size: 0.8rem; font-weight: 600; }
  }
`;

const PageTitle = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -1.5px;
  background: ${props => props.theme.colors.accentPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [metals, setMetals] = useState<MetalsData | null>(null);
  const [trending, setTrending] = useState<StockData[]>([]);
  const historicalData = getStaticHistoricalData();

  useEffect(() => {
    const loadData = async () => {
      try {
        const metalsData = await fetchLiveMetalsPrices();
        setMetals(metalsData);
        
        // Fetch some trending stocks (only once)
        if (trending.length === 0) {
          const itStocks = await yfinanceService.getSectorStocks('it');
          setTrending(itStocks.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };

    loadData();
    
    // Refresh metals every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, [trending.length]);

  return (
    <HomeContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Market Overview
      </PageTitle>

      <MarketGrid>
        {metals && (
          <>
            <MarketItem 
              positive={metals.gold.change >= 0}
              whileHover={{ scale: 1.05 }}
            >
              <h4>Gold Futures</h4>
              <div className="price">${metals.gold.price.toLocaleString()}</div>
              <div className="change">
                {metals.gold.change >= 0 ? '▲' : '▼'} {Math.abs(metals.gold.changePercent)}%
              </div>
            </MarketItem>
            <MarketItem 
              positive={metals.silver.change >= 0}
              whileHover={{ scale: 1.05 }}
            >
              <h4>Silver Futures</h4>
              <div className="price">${metals.silver.price.toLocaleString()}</div>
              <div className="change">
                {metals.silver.change >= 0 ? '▲' : '▼'} {Math.abs(metals.silver.changePercent)}%
              </div>
            </MarketItem>
          </>
        )}
        <MarketItem positive={true} whileHover={{ scale: 1.05 }}>
          <h4>S&P 500</h4>
          <div className="price">5,137.08</div>
          <div className="change">▲ 0.80%</div>
        </MarketItem>
        <MarketItem positive={false} whileHover={{ scale: 1.05 }}>
          <h4>Nasdaq</h4>
          <div className="price">16,274.94</div>
          <div className="change">▼ 0.12%</div>
        </MarketItem>
      </MarketGrid>

      <HeroSection>
        <MainCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionTitle>Market Analysis</SectionTitle>
          <PriceTrendChart 
            data={historicalData.goldHistory} 
            title="Gold" 
            color="#FFD700" 
            icon="💰"
          />
        </MainCard>

        <SidebarCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionTitle>Trending Stocks</SectionTitle>
          {trending.map(stock => (
            <FeaturedStock 
              key={stock.symbol}
              whileHover={{ x: 5 }}
              onClick={() => navigate(`/stocks/${stock.sector || 'it'}`)}
            >
              <div className="info">
                <span className="symbol">{stock.symbol}</span>
                <span className="name">{stock.name}</span>
              </div>
              <div className="values">
                <div className="price">₹{(stock.price || 0).toLocaleString()}</div>
                <div className={`change ${(stock.change || 0) >= 0 ? 'positive' : 'negative'}`} style={{ color: (stock.change || 0) >= 0 ? '#00e676' : '#ff1744' }}>
                  {(stock.change || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                </div>
              </div>
            </FeaturedStock>
          ))}
          
          <SectionTitle style={{ marginTop: '2rem' }}>Latest News</SectionTitle>
          <NewsItem to="/news">
            <h4>Global markets rally on cooling inflation data</h4>
            <span>2 hours ago • Reuters</span>
          </NewsItem>
          <NewsItem to="/news">
            <h4>Tech giants reveal ambitious AI roadmaps</h4>
            <span>4 hours ago • Bloomberg</span>
          </NewsItem>
          <NewsItem to="/news">
            <h4>Commodity prices stabilize amid supply chain improvements</h4>
            <span>5 hours ago • WSJ</span>
          </NewsItem>
        </SidebarCard>
      </HeroSection>
    </HomeContainer>
  );
};

export default Home;
