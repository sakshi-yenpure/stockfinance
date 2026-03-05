import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatbotToggle = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const ChatWindow = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: linear-gradient(135deg, rgba(30, 30, 46, 0.98) 0%, rgba(45, 45, 65, 0.98) 100%);
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  padding: 1.5rem;
  border-radius: 15px 15px 0 0;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(78, 205, 196, 0.3);
    border-radius: 10px;

    &:hover {
      background: rgba(78, 205, 196, 0.5);
    }
  }
`;

const Message = styled(motion.div)<{ isBot: boolean }>`
  display: flex;
  justify-content: ${props => props.isBot ? 'flex-start' : 'flex-end'};
  margin-bottom: 0.5rem;
`;

const MessageBubble = styled.div<{ isBot: boolean }>`
  max-width: 85%;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: ${props => props.isBot 
    ? 'rgba(78, 205, 196, 0.2)' 
    : 'rgba(78, 205, 196, 0.8)'};
  color: ${props => props.isBot ? '#ffffff' : '#ffffff'};
  border: 1px solid ${props => props.isBot 
    ? 'rgba(78, 205, 196, 0.3)' 
    : 'rgba(78, 205, 196, 0.6)'};
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.7rem;
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.9rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(78, 205, 196, 0.6);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const SendButton = styled.button`
  padding: 0.7rem 1rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FAQs = [
  {
    keywords: ['hello', 'hi', 'hey', 'start'],
    response: 'Hello! 👋 I\'m YourFinance Assistant. I can help you learn how to use our app. Try asking me about:\n• How to add stocks to portfolio\n• Understanding the PE ratio graph\n• What is K-means clustering\n• News page features\n• Gold/Silver tracking'
  },
  {
    keywords: ['portfolio', 'add stock', 'how to add'],
    response: '📈 How to add stocks to your portfolio:\n1. Go to "📈 Market Sectors"\n2. Click on any sector (Automobile, IT, etc.)\n3. Find the stock you want\n4. Click the "Add" button\n5. Go to "💼 My Portfolio" to see it!\n\nYou can remove stocks by clicking ✕'
  },
  {
    keywords: ['pe ratio', 'graph', 'chart'],
    response: '📊 PE Ratio Graph:\n• Shows how a stock\'s Price-to-Earnings ratio changes over 12 months\n• Located in the portfolio page when you click a stock\n• Helps you understand stock valuation trends\n• Green line shows the PE ratio progression'
  },
  {
    keywords: ['k-means', 'clustering', 'cluster'],
    response: '🎯 K-Means Clustering:\n• Groups stocks based on price and performance\n• 🟢 Green = High performers (change > 5%)\n• 🟡 Yellow = Stable (change -2% to 5%)\n• 🔴 Red = Declining (change < -2%)\n\nView individual clustering by clicking a stock, or see combined portfolio clustering at the top!'
  },
  {
    keywords: ['news', 'financial news', 'market news'],
    response: '📰 News Page Features:\n• Featured Story: Latest important financial news\n• Search: Find news by keyword\n• Categories: Filter by Markets, Commodities, Economy, Analysis, Education\n• News Source: See which publication reported it\n• Read More: Get to the full article'
  },
  {
    keywords: ['gold', 'silver', 'metals', 'precious'],
    response: '💰 Gold & Silver Page:\n• Real-time prices for gold and silver\n• Live price updates every 30 seconds\n• Price charts showing 12-month trends\n• Correlation analysis between gold and silver\n• Current and historical data visualization'
  },
  {
    keywords: ['stocks', 'market', 'sector', 'stock page'],
    response: '📈 Stocks & Sectors:\n1. Choose a sector from "Market Sectors"\n2. Browse stocks in that sector\n3. See current prices, changes, and P/E ratios\n4. View market opportunities (Buy/Hold/Sell)\n5. Click "Add" to add to your portfolio'
  },
  {
    keywords: ['help', 'how', 'what', 'guide', 'feature'],
    response: 'I can help you with:\n• 💼 Portfolio management\n• 📈 Stock sectors and browsing\n• 📊 Charts and analytics\n• 🎯 Clustering analysis\n• 💰 Precious metals tracking\n• 📰 Financial news\n\nWhat would you like to know more about?'
  },
  {
    keywords: ['remove', 'delete', 'remove stock'],
    response: '🗑️ How to remove a stock:\n1. Go to "💼 My Portfolio"\n2. Find the stock you want to remove\n3. Click the ✕ button on the card\n4. The stock will be removed immediately\n\nYou can also remove from inside the detailed view!'
  },
  {
    keywords: ['search', 'find', 'navigate'],
    response: '🔍 Navigation Tips:\n• Use the Navbar to switch between pages\n• Login to see your portfolio and personalized content\n• Search stocks in each sector\n• Filter news by category\n• All data updates in real-time!'
  }
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your YourFinance Assistant. How can I help you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const findResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    for (const faq of FAQs) {
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return faq.response;
      }
    }

    return "Sorry, I didn't quite understand that. Try asking me about:\n• Portfolio management\n• Stock sectors\n• Charts and graphs\n• Gold/Silver prices\n• News features\n• How to use the app";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: String(messages.length + 1),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response delay
    setTimeout(() => {
      const response = findResponse(inputValue);
      const botMessage: ChatMessage = {
        id: String(messages.length + 2),
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <ChatbotContainer>
      <ChatbotToggle
        onClick={() => setIsOpen(!isOpen)}
        animate={{ scale: isOpen ? 0.9 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Chat Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </ChatbotToggle>

      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatHeader>
              <div>🤖</div>
              <ChatTitle>YourFinance Assistant</ChatTitle>
            </ChatHeader>

            <MessageList>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  isBot={message.isBot}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble isBot={message.isBot}>
                    {message.text}
                  </MessageBubble>
                </Message>
              ))}
            </MessageList>

            <InputContainer>
              <ChatInput
                type="text"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton onClick={handleSendMessage}>Send</SendButton>
            </InputContainer>
          </ChatWindow>
        )}
      </AnimatePresence>
    </ChatbotContainer>
  );
};

export default Chatbot;
