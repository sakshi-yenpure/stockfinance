import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PERatioGraph from '../components/PERatioGraph';
import KMeansClusteringGraph from '../components/KMeansClusteringGraph';
import CombinedKMeansClustering from '../components/CombinedKMeansClustering';

const PortfolioContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #00b894, #00cec9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PortfolioCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const ExpandedCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
  padding: 0.5rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  float: right;

  &:hover {
    background: rgba(255, 107, 107, 0.4);
    transform: scale(1.05);
  }
`;

const PortfolioHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PortfolioName = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.h3`
  font-size: 1.3rem;
  color: #ffffff;
  margin: 0;
`;

const StockSymbol = styled.p`
  font-size: 0.9rem;
  color: #cccccc;
  margin: 0;
`;

const RemoveButton = styled.button`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
  padding: 0.5rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.4);
    transform: scale(1.05);
  }
`;

const PortfolioValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00b894;
  margin-bottom: 0.5rem;
`;

const PortfolioChange = styled.div<{ positive: boolean }>`
  color: ${props => props.positive ? '#00b894' : '#ff6b6b'};
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const PortfolioStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #cccccc;
  margin-bottom: 0.2rem;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffffff;
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  color: #cccccc;
`;

const EmptyText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const AnalyticsCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 3rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const SectorSection = styled(motion.div)`
  margin-bottom: 3rem;
`;

const SectorTitle = styled.h2`
  font-size: 1.8rem;
  color: #4ecdc4;
  margin-bottom: 1.5rem;
  text-transform: capitalize;
  border-bottom: 2px solid rgba(78, 205, 196, 0.3);
  padding-bottom: 0.5rem;
`;

const SectorStocksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const SectorsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SectorCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(255, 107, 107, 0.1));
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(78, 205, 196, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(78, 205, 196, 0.2);
    border-color: rgba(78, 205, 196, 0.6);
  }
`;

const SectorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const SectorCardTitle = styled.h3`
  font-size: 1.3rem;
  color: #4ecdc4;
  margin: 0 0 1rem 0;
  text-transform: capitalize;
  font-weight: 700;
`;

const SectorCardStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

const SectorStatItem = styled.div`
  text-align: center;
`;

const SectorStatLabel = styled.div`
  font-size: 0.7rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 0.3rem;
`;

const SectorStatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
`;

const SectorCardButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border: none;
  color: white;
  padding: 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const { user, portfolio, portfolioBySector, removeFromPortfolio } = useAuth();
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);

  const totalValue = portfolio.reduce((total, item) => {
    return total + item.price;
  }, 0);

  const totalChange = portfolio.reduce((total, item) => {
    return total + item.change;
  }, 0);

  const avgChange = portfolio.length > 0 ? (totalChange / portfolio.length).toFixed(2) : '0.00';
  const isPositive = parseFloat(avgChange) >= 0;

  const SECTOR_ICONS: { [key: string]: string } = {
    'it': '💻',
    'banking': '🏦',
    'automobile': '🚗',
    'energy': '⚡',
    'pharma': '💊',
    'fmcg': '🛒',
    'metals': '⛏️',
    'finance': '💰',
    'hospitality': '🏨',
    'realty': '🏢'
  };

  return (
    <PortfolioContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        💼 My Portfolio
      </PageTitle>

      <motion.div
        style={{ textAlign: 'center', marginBottom: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {user && (
          <p style={{ color: '#cccccc', marginBottom: '0.5rem' }}>
            Hello, {user.first_name || user.username}!
          </p>
        )}
        <h2 style={{ color: '#00b894', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Total Value: ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <p style={{ color: avgChange && isPositive ? '#00b894' : '#ff6b6b' }}>
          Average Change: {avgChange}% {isPositive ? '📈' : '📉'}
        </p>
      </motion.div>

      {portfolio.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <EmptyText>📊 Your portfolio is empty</EmptyText>
          <p>Click the "Add" button on any stock to add it to your portfolio</p>
        </EmptyState>
      ) : (
        <>
          {/* Combined Portfolio Analytics Card */}
          <AnalyticsCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CombinedKMeansClustering portfolio={portfolio} />
          </AnalyticsCard>

          {/* Expanded Card View */}
          {expandedSymbol && (
            <>
              {portfolio
                .filter(item => item.symbol === expandedSymbol)
                .map(item => (
                  <ExpandedCard
                    key={item.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CloseButton onClick={() => setExpandedSymbol(null)}>
                      ✕ Close
                    </CloseButton>
                    <div style={{ clear: 'both', marginBottom: '1rem' }}>
                      <StockName>{item.name}</StockName>
                      <StockSymbol>{item.symbol}</StockSymbol>
                      {item.sector && <StockSymbol style={{ color: '#4ecdc4' }}>📂 {item.sector}</StockSymbol>}
                    </div>

                    <PortfolioValue>
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </PortfolioValue>
                    <PortfolioChange positive={item.change >= 0}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}% {item.change >= 0 ? '📈' : '📉'}
                    </PortfolioChange>

                    {/* Charts Section */}
                    <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                      <PERatioGraph stockSymbol={item.symbol} stockPrice={item.price} />
                      <KMeansClusteringGraph 
                        stockSymbol={item.symbol}
                        stockPrice={item.price}
                        stockName={item.name}
                      />
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                      <RemoveButton onClick={() => {
                        removeFromPortfolio(item.symbol);
                        setExpandedSymbol(null);
                      }}>
                        Remove from Portfolio
                      </RemoveButton>
                    </div>
                  </ExpandedCard>
                ))}
            </>
          )}

          {/* Sectors Overview */}
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ color: '#4ecdc4', fontSize: '2rem', marginBottom: '1.5rem' }}>📊 Sectors</h2>
            <SectorsContainer>
              {Object.entries(portfolioBySector).map(([sector, items], sectorIndex) => {
                const sectorValue = items.reduce((total, item) => total + item.price, 0);
                const sectorChange = items.reduce((total, item) => total + item.change, 0);
                const avgSectorChange = items.length > 0 ? sectorChange / items.length : 0;
                const icon = SECTOR_ICONS[sector.toLowerCase()] || '📂';

                return (
                  <SectorCard
                    key={sector}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + sectorIndex * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/portfolio/sector/${sector}`)}
                  >
                    <SectorIcon>{icon}</SectorIcon>
                    <SectorCardTitle>{sector}</SectorCardTitle>

                    <SectorCardStats>
                      <SectorStatItem>
                        <SectorStatLabel>Stocks</SectorStatLabel>
                        <SectorStatValue>{items.length}</SectorStatValue>
                      </SectorStatItem>
                      <SectorStatItem>
                        <SectorStatLabel>Value</SectorStatLabel>
                        <SectorStatValue style={{ color: '#00b894' }}>
                          ${(sectorValue / 1000).toFixed(0)}K
                        </SectorStatValue>
                      </SectorStatItem>
                    </SectorCardStats>

                    <div style={{ marginTop: '0.5rem', color: avgSectorChange >= 0 ? '#00b894' : '#ff6b6b' }}>
                      {avgSectorChange >= 0 ? '📈' : '📉'} {avgSectorChange.toFixed(2)}%
                    </div>

                    <SectorCardButton onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/portfolio/sector/${sector}`);
                    }}>
                      View Details →
                    </SectorCardButton>
                  </SectorCard>
                );
              })}
            </SectorsContainer>
          </div>
        </>
      )}
    </PortfolioContainer>
  );
};

export default Portfolio;