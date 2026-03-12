import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import News from './pages/News';
import GoldSilver from './pages/GoldSilver';
import Stocks from './pages/Stocks';
import Portfolio from './pages/Portfolio';
import PortfolioSector from './pages/PortfolioSector';
import Signup from './pages/Signup';
import SectorStocks from './pages/SectorStocks';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import { theme } from './styles/theme';
import './App.css';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textPrimary};
    font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textPrimary};
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.03) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
`;

const MainContent = styled(motion.div)`
  padding: 20px;
  margin-top: 80px;
  position: relative;
  z-index: 1;
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition: any = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AuthProvider>
          <AppContainer>
            <Navbar />
            <Chatbot />
            <AnimatePresence mode="wait">
              <MainContent
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/gold-silver" element={<GoldSilver />} />
                  <Route path="/stocks" element={<Stocks />} />
                  <Route path="/stocks/:sector" element={<SectorStocks />} />
                  <Route
                    path="/portfolio"
                    element={
                      <RequireAuth>
                        <Portfolio />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/portfolio/sector/:sector"
                    element={
                      <RequireAuth>
                        <PortfolioSector />
                      </RequireAuth>
                    }
                  />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </MainContent>
            </AnimatePresence>
          </AppContainer>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;