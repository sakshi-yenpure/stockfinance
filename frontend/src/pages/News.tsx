import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 3rem;
  text-align: left;
  font-weight: 800;
  letter-spacing: -1.5px;
  background: ${props => props.theme.colors.accentPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeaturedSection = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 3rem;
  margin-bottom: 4rem;
  border: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.theme.colors.accentPrimary};
  }
`;

const FeaturedTitle = styled.h2`
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 1.5rem 0;
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.2;
`;

const FeaturedContent = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.8;
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
`;

const FeaturedMeta = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 1rem 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 0.6rem 1.2rem;
  border: 2px solid ${props => props.active ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.active ? 'rgba(78, 205, 196, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#4ecdc4' : '#cccccc'};
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4ecdc4;
    color: #4ecdc4;
  }
`;

const NewsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const NewsCard = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: ${props => props.theme.transitions.default};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const NewsCategory = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: rgba(78, 205, 196, 0.2);
  color: #4ecdc4;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  width: fit-content;
`;

const NewsTitle = styled.h3`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const NewsFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const NewsDate = styled.span`
  color: #4ecdc4;
  font-size: 0.9rem;
`;

const ReadMoreButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

const newsItems = [
  {
    title: '📈 Stock Market Hits All-Time High',
    content: 'Major indices reached record levels as investor confidence grows amid economic recovery. Market sentiment remains bullish with strong institutional buying.',
    date: 'March 4, 2026',
    category: 'Markets',
    source: 'Financial Times'
  },
  {
    title: '💰 Gold Prices Surge 5%',
    content: 'Precious metals see strong demand as investors seek safe-haven assets. Gold futures trading at highest levels in months.',
    date: 'March 3, 2026',
    category: 'Commodities',
    source: 'Reuters'
  },
  {
    title: '🌍 Global Economic Outlook Improves',
    content: 'IMF revises growth forecasts upward as key economies show resilience. Emerging markets lead the recovery charge.',
    date: 'March 2, 2026',
    category: 'Economy',
    source: 'Bloomberg'
  },
  {
    title: '💼 Portfolio Diversification Tips',
    content: 'Expert advice on building a balanced investment portfolio in uncertain times. Learn strategies from top portfolio managers.',
    date: 'March 1, 2026',
    category: 'Analysis',
    source: 'Motley Fool'
  },
  {
    title: '📊 Tech Stocks Lead Market Rally',
    content: 'Technology sector continues to outperform as innovation drives growth. AI and cloud computing stocks show exceptional gains.',
    date: 'February 28, 2026',
    category: 'Markets',
    source: 'CNBC'
  },
  {
    title: '🔒 Security Best Practices for Investors',
    content: 'How to protect your financial accounts and personal information online. Multi-factor authentication and secure passwords matter.',
    date: 'February 27, 2026',
    category: 'Education',
    source: 'Investor Daily'
  }
];

const News: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Markets', 'Commodities', 'Economy', 'Analysis', 'Education'];

  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = newsItems[0];

  return (
    <NewsContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📰 Financial News & Market Updates
      </PageTitle>

      {/* Featured News Section */}
      <FeaturedSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <FeaturedTitle>⭐ Featured Story</FeaturedTitle>
        <FeaturedContent>{featuredNews.title}</FeaturedContent>
        <FeaturedContent style={{ fontSize: '0.95rem', color: '#dddddd' }}>
          {featuredNews.content}
        </FeaturedContent>
        <FeaturedMeta>
          <MetaItem>📅 {featuredNews.date}</MetaItem>
          <MetaItem>🏷️ {featuredNews.category}</MetaItem>
          <MetaItem>📰 {featuredNews.source}</MetaItem>
        </FeaturedMeta>
      </FeaturedSection>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search news by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        <CategoryFilter>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryFilter>
      </motion.div>

      {/* News Grid */}
      <NewsGrid>
        {filteredNews.map((news, index) => (
          <NewsCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <NewsCategory>{news.category}</NewsCategory>
            <NewsTitle>{news.title}</NewsTitle>
            <NewsSummary>{news.content}</NewsSummary>
            <NewsFooter>
              <div>
                <NewsDate>{news.date}</NewsDate>
                <div style={{ fontSize: '0.8rem', color: '#999999', marginTop: '0.3rem' }}>
                  by {news.source}
                </div>
              </div>
              <ReadMoreButton>Read →</ReadMoreButton>
            </NewsFooter>
          </NewsCard>
        ))}
      </NewsGrid>

      {filteredNews.length === 0 && (
        <motion.div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#cccccc',
            fontSize: '1.2rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🔍 No news found matching your search or category filter.
        </motion.div>
      )}
    </NewsContainer>
  );
};

export default News;