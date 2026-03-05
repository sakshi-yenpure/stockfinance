import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { yfinanceService, StockData } from '../services/yfinanceService';
import { useAuth } from '../contexts/AuthContext';

const SectorStocksContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const PageHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectorTitle = styled(motion.h1)`
  font-size: 2.5rem;
  background: linear-gradient(45deg, #4ecdc4, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const BackButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const RefreshButton = styled(motion.button)<{ isLoading?: boolean }>`
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${props => props.isLoading ? 0.7 : 1};
  
  &:hover {
    transform: ${props => props.isLoading ? 'none' : 'translateY(-2px)'};
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const SearchContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: #cccccc;
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ResultsContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
`;

const StockTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    font-weight: 600;
    color: #4ecdc4;
    background: rgba(255, 255, 255, 0.05);
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const AddButton = styled.button<{ isAdded?: boolean }>`
  background: ${props => props.isAdded 
    ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' 
    : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'};
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: ${props => props.isAdded ? 'default' : 'pointer'};
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    ${props => !props.isAdded && 'transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);'}
  }
`;

const LoadingState = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  color: #cccccc;
`;

const ErrorState = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 107, 107, 0.2);
`;

const SectorStocks: React.FC = () => {
  const { sector } = useParams<{ sector: string }>();
  const navigate = useNavigate();
  const { addToPortfolio } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [addedStocks, setAddedStocks] = useState<Set<string>>(new Set());

  const fetchSectorStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await yfinanceService.getSectorStocks(sector!);
      setStocks(response);
    } catch (err) {
      console.error('Error fetching sector stocks:', err);
      setError('Failed to fetch stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [sector]);

  useEffect(() => {
    if (sector) {
      fetchSectorStocks();
    }
  }, [sector, fetchSectorStocks]);

  const handleRefreshPrices = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/auth/stocks/sector/${sector}/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh prices');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update stocks with refreshed data
        const updatedStocks = data.stocks.map((stock: any) => ({
          symbol: stock.symbol,
          name: stock.name,
          currentPrice: stock.current_price,
          change: stock.change,
          changePercent: stock.change_percent,
          dayHigh: stock.day_high,
          dayLow: stock.day_low,
          peRatio: stock.pe_ratio,
          marketCap: stock.market_cap,
          volume: stock.volume
        }));
        setStocks(updatedStocks);
        alert('Stock prices refreshed and saved successfully!');
      } else {
        setError('Failed to refresh prices');
      }
    } catch (err) {
      console.error('Error refreshing prices:', err);
      setError('Failed to refresh prices. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToPortfolio = (stock: StockData) => {
    addToPortfolio({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.currentPrice ?? 0,
      change: stock.change ?? 0,
      addedAt: new Date().toISOString(),
      sector: sector  // Add sector information
    });
    setAddedStocks(new Set(addedStocks).add(stock.symbol));
  };

  if (!sector) {
    return <div>Invalid sector</div>;
  }

  const sectorName = sector.charAt(0).toUpperCase() + sector.slice(1);

  return (
    <SectorStocksContainer>
      <PageHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectorTitle>{sectorName} STOCKS</SectorTitle>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <RefreshButton
            onClick={handleRefreshPrices}
            isLoading={refreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={refreshing}
          >
            {refreshing ? '⏳' : '🔄'} Refresh Prices
          </RefreshButton>
          <BackButton
            onClick={() => navigate('/stocks')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Sectors
          </BackButton>
        </div>
      </PageHeader>

      <SearchContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <SearchInput
          type="text"
          placeholder={`Search Indian ${sectorName} companies (e.g., ${sector === 'it' ? 'HCL' : 'TATA'})`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      {loading && (
        <LoadingState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading {sectorName} stocks data...</p>
        </LoadingState>
      )}

      {error && (
        <ErrorState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <p>{error}</p>
          <button 
            onClick={fetchSectorStocks}
            style={{ 
              marginTop: '1rem', 
              padding: '0.5rem 1rem', 
              background: '#ff6b6b', 
              border: 'none', 
              borderRadius: '5px', 
              color: 'white', 
              cursor: 'pointer' 
            }}
          >
            Retry
          </button>
        </ErrorState>
      )}

      {!loading && !error && (
        <ResultsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {filteredStocks.length > 0 ? (
            <StockTable>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Symbol</th>
                  <th>Current Price (₹)</th>
                  <th>Today's Change</th>
                  <th>Change %</th>
                  <th>Day High</th>
                  <th>Day Low</th>
                  <th>P/E Ratio</th>
                  <th>Market Cap</th>
                  <th>Volume</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock, index) => (
                  <tr key={index}>
                    <td>{stock.name}</td>
                    <td>{stock.symbol}</td>
                    <td>₹{(stock.currentPrice ?? 0).toLocaleString('en-IN')}</td>
                    <td style={{ color: (stock.change ?? 0) >= 0 ? '#4caf50' : '#f44336' }}>
                      {(stock.change ?? 0) >= 0 ? '+' : ''}₹{(stock.change ?? 0).toFixed(2)}
                    </td>
                    <td style={{ color: (stock.changePercent ?? 0) >= 0 ? '#4caf50' : '#f44336' }}>
                      {(stock.changePercent ?? 0) >= 0 ? '+' : ''}{(stock.changePercent ?? 0).toFixed(2)}%
                    </td>
                    <td>₹{(stock.dayHigh ?? 0).toLocaleString('en-IN')}</td>
                    <td>₹{(stock.dayLow ?? 0).toLocaleString('en-IN')}</td>
                    <td>{(stock.peRatio ?? 0).toFixed(2)}</td>
                    <td>₹{((stock.marketCap ?? 0) / 10000000).toFixed(0)} Cr</td>
                    <td>{(stock.volume ?? 0).toLocaleString('en-IN')}</td>
                    <td>
                      <AddButton 
                        isAdded={addedStocks.has(stock.symbol)}
                        onClick={() => !addedStocks.has(stock.symbol) && handleAddToPortfolio(stock)}
                        disabled={addedStocks.has(stock.symbol)}
                      >
                        {addedStocks.has(stock.symbol) ? '✓ Added' : 'Add'}
                      </AddButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StockTable>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#cccccc' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p>No stocks found matching your search criteria.</p>
            </div>
          )}
        </ResultsContainer>
      )}
    </SectorStocksContainer>
  );
};

export default SectorStocks;