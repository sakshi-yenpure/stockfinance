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
  background: rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(20px);
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled(motion.div)`
  font-size: 1.6rem;
  font-weight: 800;
  background: ${props => props.theme.colors.accentPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: ${props => props.theme.transitions.default};
  position: relative;
  font-weight: 600;
  font-size: 0.95rem;

  &:hover {
    color: ${props => props.theme.colors.textPrimary};
    background: rgba(255, 255, 255, 0.05);
  }

  &.active {
    color: ${props => props.theme.colors.textPrimary};
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: ${props => props.theme.colors.accentPrimary};
  border-radius: 2px;
  box-shadow: ${props => props.theme.shadows.glow};
`;

const SignupButton = styled(motion.button)`
  background: ${props => props.theme.colors.accentPrimary};
  color: #000;
  border: none;
  padding: 0.7rem 1.6rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 700;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow};
    opacity: 0.9;
  }
`;

const LogoutButton = styled(motion.button)`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 0.6rem 1.2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  font-size: 0.9rem;

  &:hover {
    color: ${props => props.theme.colors.textPrimary};
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/news', label: 'News' },
    { path: '/gold-silver', label: 'Gold/Silver' },
    { path: '/stocks', label: 'Stocks' },
  ];
  if (user) {
    navItems.push({ path: '/portfolio', label: 'Portfolio' });
  }

  return (
    <NavbarContainer>
      <Logo
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        PLUTUS
      </Logo>

      <NavLinks>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            {item.label}
            {location.pathname === item.path && (
              <Underline layoutId="underline" />
            )}
          </NavLink>
        ))}
        
        {user ? (
          <LogoutButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </LogoutButton>
        ) : (
          <SignupButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </SignupButton>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;