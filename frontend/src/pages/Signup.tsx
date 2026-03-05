import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
  }

  &::placeholder {
    color: #cccccc;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { register } = useAuth();
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
      // call backend register endpoint via auth context
      await register({
        username: formData.email,          // use email as username
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirm: formData.password,
        first_name: formData.name
      });

      setSuccess(true);
      // navigate to home after a short delay so user sees success message
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      // backend may return detailed errors
      if (err && err.errors) {
        // pick first error message, ensure string
        const messages = Object.values(err.errors).flat() as any[];
        const first = messages.length > 0 ? messages[0] : '';
        setError(typeof first === 'string' ? first : String(first) || 'Registration failed');
      } else if (err && err.message) {
        setError(String(err.message));
      } else {
        setError('Registration failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignupContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🚀 Create Account
      </PageTitle>

      <SignupForm
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        <FormGroup>
          <Label>👤 Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
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
            placeholder="Enter your phone number"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>📧 Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
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
            placeholder="Create a strong password"
            required
          />
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? 'Creating Account...' : '🎯 Sign Up Now'}
        </SubmitButton>

        {success && (
          <SuccessMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✅ Account created successfully! Welcome to YOUR FINANCE!
          </SuccessMessage>
        )}

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ❌ {error}
          </ErrorMessage>
        )}
      </SignupForm>

      <motion.p
        style={{ textAlign: 'center', color: '#cccccc', marginTop: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Already have an account? <a href="/" style={{ color: '#4ecdc4' }}>Sign in here</a>
      </motion.p>
    </SignupContainer>
  );
};

export default Signup;