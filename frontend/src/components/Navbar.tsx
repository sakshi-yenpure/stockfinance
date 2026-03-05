import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(15, 12, 41, 0.9);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled(motion.div)`
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 2px;
`;

const SignupButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navItems = [
    { path: '/news', label: '📰 News', emoji: '📰' },
    { path: '/gold-silver', label: '💰 Gold/Silver', emoji: '💰' },
    { path: '/stocks', label: '📈 Stocks', emoji: '📈' },
  ];
  if (user) {
    navItems.push({ path: '/portfolio', label: '💼 Portfolio', emoji: '💼' });
  }

  return (
    <NavbarContainer>
      <Logo
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        💰 YOUR FINANCE
      </Logo>

      <NavLinks>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            onMouseEnter={() => setHoveredLink(item.path)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {item.label}
            {hoveredLink === item.path && (
              <Underline
                layoutId="underline"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </NavLink>
        ))}
        
        {user ? (
          <SignupButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            🔓 Logout
          </SignupButton>
        ) : (
          <SignupButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
          >
            🚀 Sign Up
          </SignupButton>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;