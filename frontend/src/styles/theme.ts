export const theme = {
  colors: {
    background: '#050505',
    secondaryBackground: '#0d0d0d',
    cardBackground: 'rgba(255, 255, 255, 0.04)',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0a0',
    accentPrimary: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    accentSecondary: 'linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%)',
    border: 'rgba(255, 255, 255, 0.08)',
    success: '#00e676',
    danger: '#ff1744',
    warning: '#ffea00',
    info: '#00b0ff'
  },
  shadows: {
    card: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
    glow: '0 0 15px rgba(0, 242, 254, 0.3)'
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px'
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export type ThemeType = typeof theme;
