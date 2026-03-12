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
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: ${props => props.theme.colors.accentPrimary};
  border: none;
  color: #000;
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.glow};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    transform: scale(1.1) rotate(5deg);
  }
`;

const ChatWindow = styled(motion.div)`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  height: 550px;
  background: rgba(13, 13, 13, 0.95);
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.card};
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(25px);
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: ${props => props.theme.colors.secondaryBackground};
  padding: 1.2rem 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: ${props => props.theme.colors.accentPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 10px;
  }
`;

const Message = styled(motion.div)<{ isBot: boolean }>`
  display: flex;
  justify-content: ${props => props.isBot ? 'flex-start' : 'flex-end'};
  margin-bottom: 0.5rem;
`;

const MessageBubble = styled.div<{ isBot: boolean }>`
  max-width: 85%;
  padding: 0.8rem 1.2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.isBot ? props.theme.colors.secondaryBackground : props.theme.colors.accentPrimary};
  color: ${props => props.isBot ? props.theme.colors.textPrimary : '#000'};
  font-size: 0.95rem;
  line-height: 1.5;
  border: 1px solid ${props => props.isBot ? props.theme.colors.border : 'transparent'};
  box-shadow: ${props => !props.isBot ? props.theme.shadows.glow : 'none'};
`;

const InputContainer = styled.form`
  padding: 1.2rem;
  background: ${props => props.theme.colors.secondaryBackground};
  display: flex;
  gap: 0.8rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Input = styled.input`
  flex: 1;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 0.7rem 1rem;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.9rem;
  transition: ${props => props.theme.transitions.default};

  &:focus {
    outline: none;
    border-color: #4facfe;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.colors.accentPrimary};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    keywords: ['hello', 'hi', 'hey', 'start', 'plutus'],
    response: 'Hello! 👋 I\'m Plutus Assistant. I can help you manage your wealth and understand market trends. Try asking me about:\n• Portfolio management\n• Market sectors\n• Analytics and indicators (RSI, MA20)\n• Precious metals (Gold/Silver)\n• Financial news and predictions'
  },
  {
    keywords: ['portfolio', 'add stock', 'how to add', 'my stocks'],
    response: '💼 Portfolio Management:\n1. Browse "📈 Stocks" in the sidebar.\n2. Select a sector (e.g., IT, Banking).\n3. Click "Add" on any stock card.\n4. Access your "💼 Portfolio" to view totals and P/E trends.\n\n*Note: You must be logged in to save your portfolio.*'
  },
  {
    keywords: ['pe ratio', 'p/e', 'valuation', 'expensive'],
    response: '📊 P/E Ratio (Price-to-Earnings):\n• It shows how much you pay for $1 of a company\'s profit.\n• High P/E: Investors expect high growth (or the stock is overvalued).\n• Low P/E: The stock might be undervalued or have low growth potential.\n• We track your portfolio\'s P/E over time to monitor valuation trends.'
  },
  {
    keywords: ['rsi', 'relative strength', 'overbought', 'oversold'],
    response: '📉 RSI (Relative Strength Index):\n• RSI < 30: The asset is "Oversold" (potential buying opportunity).\n• RSI > 70: The asset is "Overbought" (potential selling signal).\n• We integrate RSI into our metals and stock charts to help you spot entry/exit points.'
  },
  {
    keywords: ['ma20', 'moving average', 'trend line', 'sma'],
    response: '📈 MA20 (20-Day Moving Average):\n• It calculates the average price over the last 20 days.\n• Price > MA20: Strong bullish momentum.\n• Price < MA20: Potential bearish trend.\n• We use this on our Gold/Silver graphs to smooth out daily volatility.'
  },
  {
    keywords: ['gold', 'silver', 'metals', 'rate', 'price'],
    response: '💰 Precious Metals:\n• Gold (XAU): Current spot price around $5,173.73/oz.\n• Silver (XAG): Current spot price around $85.3735/oz.\n• Gold is a "safe haven" during inflation, while Silver has high industrial use.'
  },
  {
    keywords: ['prediction', 'future', 'forecast', 'march'],
    response: '🔮 Market Predictions:\n• We use statistical models for 15-day and monthly (March) forecasts.\n• "Bullish": Expecting prices to rise (🚀).\n• "Bearish": Expecting prices to fall (📉).\n• Check our daily March prediction table on the Gold/Silver page!'
  },
  {
    keywords: ['api key', 'secret', 'developer', 'plutus_'],
    response: '🔑 API Keys:\n• Every Plutus user gets a unique API key (e.g., plutus_abc...).\n• You can find yours in the Profile or after logging in.\n• Use this key to access our backend financial endpoints programmatically.'
  },
  {
    keywords: ['bullish', 'bearish', 'market trend', 'up', 'down'],
    response: '🐂 Bullish vs 🐻 Bearish:\n• Bullish: Prices are going up. Think of a bull tossing prices up with its horns!\n• Bearish: Prices are going down. Think of a bear swiping prices down with its paws.'
  },
  {
    keywords: ['login', 'signup', 'account', 'register'],
    response: '🔐 Account Access:\n• Use the "Sign Up" toggle to switch between Login and Register.\n• Creating an account lets you save your portfolio and view your API key.'
  },
  {
    keywords: ['help', 'options', 'what can you do', 'features'],
    response: '🛠️ Plutus Features:\n• Live Market Tracking (Stocks & Metals)\n• Advanced Analytics (RSI, MA20, Correlation)\n• AI-Driven Price Predictions\n• Real-Time Financial News\n• Secure Portfolio Management'
  },
  {
    keywords: ['market cap', 'capitalization', 'large cap', 'mid cap'],
    response: '🏢 Market Capitalization:\n• The total value of all a company\'s shares.\n• Large Cap: Stable, established companies (e.g., Apple, Reliance).\n• Mid/Small Cap: Higher growth potential but higher risk.\n• We display market caps to help you understand company size.'
  },
  {
    keywords: ['dividend', 'yield', 'payout'],
    response: '💰 Dividends:\n• A portion of company profits paid out to shareholders.\n• Dividend Yield: The annual dividend payment divided by the stock price.\n• High-yield stocks are often favored for steady income.'
  },
  {
    keywords: ['volatility', 'risk', 'beta', 'swing'],
    response: '📉 Volatility:\n• How much an asset\'s price swings up or down.\n• High Volatility: Fast price changes (higher risk/reward).\n• Low Volatility: Steady price movements (lower risk).\n• Our K-Means clustering helps you identify volatile stocks in your portfolio.'
  },
  {
    keywords: ['index', 's&p 500', 'nifty', 'market benchmark'],
    response: '📈 Market Indices:\n• An Index tracks a group of stocks to represent the overall market (e.g., S&P 500, Nifty 50).\n• It acts as a benchmark to compare your portfolio\'s performance.'
  }
];

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.secondaryBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  width: fit-content;
  border: 1px solid ${props => props.theme.colors.border};

  span {
    width: 6px;
    height: 6px;
    background: ${props => props.theme.colors.accentPrimary};
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  span:nth-child(1) { animation-delay: -0.32s; }
  span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
  }
`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your Plutus Assistant. How can I help you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const findResponse = (userMessage: string): string => {
    const words = userMessage.toLowerCase().trim().split(/\s+/);
    let bestMatch = null;
    let highestScore = 0;

    for (const faq of FAQs) {
      let score = 0;
      for (const keyword of faq.keywords) {
        if (userMessage.toLowerCase().includes(keyword)) {
          score += 2; // Exact keyword match
        }
        for (const word of words) {
          if (word === keyword) score += 3; // Word-for-word match
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    }

    if (highestScore > 1) {
      return bestMatch!.response;
    }

    return "I'm still learning about that! 🧠 Try asking about:\n• Gold/Silver prices\n• P/E Ratio or RSI\n• Portfolio management\n• Market predictions\n• App features like API keys";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsgText = inputValue;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userMsgText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking/typing
    setTimeout(() => {
      const response = findResponse(userMsgText);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <ChatbotContainer>
      <ChatbotToggle
        onClick={() => setIsOpen(!isOpen)}
        animate={{ scale: isOpen ? 0.9 : 1 }}
        title="Chat Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </ChatbotToggle>

      <AnimatePresence mode="wait">
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <ChatHeader>
              <ChatTitle>Assistant</ChatTitle>
              <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Online</div>
            </ChatHeader>

            <MessageList>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  isBot={message.isBot}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <MessageBubble isBot={message.isBot}>
                    {message.text.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </MessageBubble>
                </Message>
              ))}
              {isTyping && (
                <Message isBot={true} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <TypingIndicator>
                    <span></span>
                    <span></span>
                    <span></span>
                  </TypingIndicator>
                </Message>
              )}
            </MessageList>

            <InputContainer onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <SendButton type="submit" disabled={!inputValue.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </SendButton>
            </InputContainer>
          </ChatWindow>
        )}
      </AnimatePresence>
    </ChatbotContainer>
  );
};

export default Chatbot;
