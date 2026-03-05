import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StocksContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const PageTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #4ecdc4, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectorGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SectorCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const SectorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SectorIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const SectorName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const SectorDescription = styled.p`
  color: #cccccc;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

const SectorStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #4ecdc4;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #888;
`;

const sectors = [
  {
    id: 1,
    name: 'Automobile',
    icon: '🚗',
    description: 'Leading automotive companies and electric vehicle manufacturers driving the future of transportation.',
    stats: {
      companies: '120+',
      growth: '+8.2%',
      marketCap: '$2.1T'
    }
  },
  {
    id: 2,
    name: 'Hospitality',
    icon: '🏨',
    description: 'Hotels, restaurants, travel services and leisure companies shaping the global hospitality industry.',
    stats: {
      companies: '85+',
      growth: '+12.5%',
      marketCap: '$1.8T'
    }
  },
  {
    id: 3,
    name: 'Finance',
    icon: '💼',
    description: 'Financial services, investment firms, insurance companies and fintech innovators transforming finance.',
    stats: {
      companies: '200+',
      growth: '+6.8%',
      marketCap: '$4.5T'
    }
  },
  {
    id: 4,
    name: 'Banking',
    icon: '🏦',
    description: 'Global banking institutions, investment banks and financial intermediaries powering economic growth.',
    stats: {
      companies: '150+',
      growth: '+5.3%',
      marketCap: '$3.9T'
    }
  },
  {
    id: 5,
    name: 'Energy',
    icon: '⚡',
    description: 'Oil, gas, power generation, and renewable energy companies driving global energy infrastructure.',
    stats: {
      companies: '95+',
      growth: '+9.1%',
      marketCap: '$3.2T'
    }
  },
  {
    id: 6,
    name: 'Pharma',
    icon: '💊',
    description: 'Pharmaceutical companies, biotech firms, and healthcare innovators revolutionizing medicine.',
    stats: {
      companies: '110+',
      growth: '+7.4%',
      marketCap: '$2.8T'
    }
  },
  {
    id: 7,
    name: 'FMCG',
    icon: '🛒',
    description: 'Fast-moving consumer goods, food, beverages and personal care brands serving daily needs.',
    stats: {
      companies: '75+',
      growth: '+4.9%',
      marketCap: '$1.5T'
    }
  },
  {
    id: 8,
    name: 'Metals',
    icon: '⛏️',
    description: 'Steel, aluminum, mining and mineral processing companies supplying to global industries.',
    stats: {
      companies: '85+',
      growth: '+11.2%',
      marketCap: '$2.3T'
    }
  },
  {
    id: 9,
    name: 'Realty',
    icon: '🏢',
    description: 'Real estate developers, property companies and construction firms building the future.',
    stats: {
      companies: '65+',
      growth: '+13.8%',
      marketCap: '$1.9T'
    }
  }
];

const Stocks: React.FC = () => {
  const navigate = useNavigate();

  const handleSectorClick = (sectorName: string) => {
    navigate(`/stocks/${sectorName.toLowerCase()}`);
  };

  return (
    <StocksContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📈 Market Sectors
      </PageTitle>

      <SectorGrid>
        {sectors.map((sector, index) => (
          <SectorCard
            key={sector.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSectorClick(sector.name)}
          >
            <SectorHeader>
              <SectorIcon>{sector.icon}</SectorIcon>
              <SectorName>{sector.name}</SectorName>
            </SectorHeader>
            
            <SectorDescription>{sector.description}</SectorDescription>
            
            <SectorStats>
              <StatItem>
                <StatValue>{sector.stats.companies}</StatValue>
                <StatLabel>Companies</StatLabel>
              </StatItem>
              
              <StatItem>
                <StatValue>{sector.stats.growth}</StatValue>
                <StatLabel>Growth</StatLabel>
              </StatItem>
              
              <StatItem>
                <StatValue>{sector.stats.marketCap}</StatValue>
                <StatLabel>Market Cap</StatLabel>
              </StatItem>
            </SectorStats>
          </SectorCard>
        ))}
      </SectorGrid>
    </StocksContainer>
  );
};

export default Stocks;