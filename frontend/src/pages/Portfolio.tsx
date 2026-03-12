import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  font-size: 3rem;
  margin-bottom: 3rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  background: ${props => props.theme.colors.accentPrimary};
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

const StockCard = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: ${props => props.theme.transitions.default};

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const StockName = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.3rem;
  font-weight: 600;
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
  font-size: 3rem;
  font-weight: 800;
  color: ${props => props.theme.colors.success};
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
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
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 3rem;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 4rem;
  backdrop-filter: blur(10px);
`;

const SectorSection = styled(motion.div)`
  margin-bottom: 3rem;
`;

const SectorTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 2rem;
  font-weight: 700;
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
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: ${props => props.theme.transitions.default};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const SectorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const SectorCardTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
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
  background: ${props => props.theme.colors.accentPrimary};
  border: none;
  color: #000;
  padding: 0.8rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  font-weight: 700;
  margin-top: 1.5rem;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow};
    opacity: 0.9;
  }
`;

const NewsletterSection = styled(motion.div)`
  margin-top: 4rem;
  padding: 3rem;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  backdrop-filter: blur(10px);
`;

const NewsletterTitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  background: ${props => props.theme.colors.accentPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

const NewsletterButton = styled.button`
  background: ${props => props.theme.colors.accentPrimary};
  border: none;
  color: #000;
  padding: 1rem 2.5rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.glow};

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

const PaymentModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  background: #1a1a1a;
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  z-index: 1001;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.5rem;
`;

const PaymentInput = styled.input`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 10px;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4facfe;
  }
`;

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const { user, portfolio, portfolioBySector, removeFromPortfolio } = useAuth();
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({ card: '', expiry: '', cvv: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // First subscribe
      await fetch('/api/auth/newsletter/subscribe/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ email: user?.email })
      });

      // Then process payment
      await fetch('/api/auth/payments/dummy/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          amount: 9.99,
          card_number: paymentData.card,
          expiry: paymentData.expiry,
          cvv: paymentData.cvv
        })
      });

      alert('Successfully subscribed! Thank you for your payment.');
      setShowPayment(false);
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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

          <NewsletterSection
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <NewsletterTitle>Do you want our newsletter?</NewsletterTitle>
            <p style={{ color: '#888', marginBottom: '2rem' }}>
              Get exclusive daily insights, market predictions, and portfolio tips for just $9.99/month.
            </p>
            <NewsletterButton onClick={() => setShowPayment(true)}>
              Subscribe Now 🚀
            </NewsletterButton>
          </NewsletterSection>

          <AnimatePresence>
            {showPayment && (
              <>
                <Overlay 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPayment(false)}
                />
                <PaymentModal
                  initial={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
                >
                  <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>💳 Dummy Payment</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem' }}>Enter any dummy details to test the integration.</p>
                  
                  <PaymentForm onSubmit={handlePayment}>
                    <PaymentInput 
                      placeholder="Card Number (16 digits)" 
                      maxLength={16}
                      required
                      value={paymentData.card}
                      onChange={e => setPaymentData({...paymentData, card: e.target.value})}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <PaymentInput 
                        placeholder="MM/YY" 
                        maxLength={5}
                        required
                        value={paymentData.expiry}
                        onChange={e => setPaymentData({...paymentData, expiry: e.target.value})}
                      />
                      <PaymentInput 
                        placeholder="CVV" 
                        maxLength={3}
                        required
                        value={paymentData.cvv}
                        onChange={e => setPaymentData({...paymentData, cvv: e.target.value})}
                      />
                    </div>
                    <NewsletterButton type="submit" disabled={isProcessing} style={{ marginTop: '1rem' }}>
                      {isProcessing ? 'Processing...' : 'Pay $9.99'}
                    </NewsletterButton>
                    <button 
                      type="button"
                      onClick={() => setShowPayment(false)}
                      style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </PaymentForm>
                </PaymentModal>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </PortfolioContainer>
  );
};

export default Portfolio;