import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeaturedSection = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(78, 205, 196, 0.2) 100%);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const FeaturedTitle = styled.h2`
  color: #ff6b6b;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const FeaturedContent = styled.p`
  color: #ffffff;
  line-height: 1.8;
  margin: 0 0 1rem 0;
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
  color: #cccccc;
  font-size: 0.9rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
    border-color: rgba(255, 255, 255, 0.4);
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

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const NewsCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
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
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #ffffff;
  flex-grow: 1;
`;

const NewsContent = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;
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
            <NewsContent>{news.content}</NewsContent>
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