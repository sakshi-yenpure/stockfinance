import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import News from './pages/News';
import GoldSilver from './pages/GoldSilver';
import Stocks from './pages/Stocks';
import Portfolio from './pages/Portfolio';
import PortfolioSector from './pages/PortfolioSector';
import Signup from './pages/Signup';
import SectorStocks from './pages/SectorStocks';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const MainContent = styled(motion.div)`
  padding: 20px;
  margin-top: 80px;
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
    <Router>
      <AuthProvider>
        <AppContainer>
          <Navbar />
          <Chatbot />
          <MainContent
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Routes>
              <Route path="/" element={<News />} />
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
        </AppContainer>
      </AuthProvider>
    </Router>
  );
}

export default App;