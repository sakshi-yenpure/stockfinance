import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupContainer = styled.div`
  max-width: 500px;
  margin: 4rem auto;
  padding: 3rem;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  border: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(20px);
  box-shadow: ${props => props.theme.shadows.card};
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 800;
  letter-spacing: -1px;
  background: ${props => props.theme.colors.accentPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SignupForm = styled(motion.form)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.2rem;
  margin-bottom: 1.2rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: ${props => props.theme.colors.accentPrimary};
  color: #000;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.glow};
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;

  span {
    color: #4facfe;
    cursor: pointer;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(0, 184, 148, 0.2);
  border: 1px solid rgba(0, 184, 148, 0.3);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: #00b894;
  margin-top: 1rem;
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: #ff6b6b;
  margin-top: 1rem;
`;

const Signup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { register, login, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        await login({
          username: formData.email,
          password: formData.password
        });
      } else {
        await register({
          username: formData.email,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirm: formData.password,
          first_name: formData.name
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      if (err && err.errors) {
        const messages = Object.values(err.errors).flat() as any[];
        const first = messages.length > 0 ? messages[0] : '';
        setError(typeof first === 'string' ? first : String(first) || 'Authentication failed');
      } else if (err && err.message) {
        setError(String(err.message));
      } else {
        setError(isLogin ? 'Login failed' : 'Registration failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && success) {
    return (
      <SignupContainer>
        <Title>Welcome Back, {user.first_name || user.username}!</Title>
        <SuccessMessage>
          Authentication Successful! 🚀<br/>
          Your API Key: <code>{user.api_key}</code>
        </SuccessMessage>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
          Redirecting to home...
        </p>
      </SignupContainer>
    );
  }

  return (
    <SignupContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLogin ? '🔐 Welcome Back' : '🚀 Create Account'}
      </Title>

      <SignupForm
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit}
      >
        {!isLogin && (
          <>
            <FormGroup>
              <Label>👤 Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>📞 Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
                required
              />
            </FormGroup>
          </>
        )}

        <FormGroup>
          <Label>📧 Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>🔒 Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
        </FormGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SignupForm>

      <SwitchText>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? 'Sign up here' : 'Login here'}
        </span>
      </SwitchText>
    </SignupContainer>
  );
};

export default Signup;