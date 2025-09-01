import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 4px;
`;

const ToggleContainer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #c0392b;
  }
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  margin-top: 8px;
  font-size: 0.875rem;
  color: #666;
  text-decoration: none;
  
  &:hover {
    color: #e74c3c;
    text-decoration: underline;
  }
`;

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/';
  
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    if (!isLogin && (!firstName || !lastName)) {
      setError('All fields are required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Handle login
        await login(email, password);
      } else {
        // Handle registration
        await register({
          email,
          password,
          firstName,
          lastName
        });
      }
      
      // Redirect to the intended page after successful authentication
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Authentication error:', err);
      setError(isLogin ? 'Invalid email or password' : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <PageTitle>{isLogin ? 'Login' : 'Create Account'}</PageTitle>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </FormGroup>
            </>
          )}
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {isLogin && (
              <ForgotPasswordLink to="/forgot-password">
                Forgot password?
              </ForgotPasswordLink>
            )}
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button 
            type="submit" 
            fullWidth 
            size="large" 
            disabled={isLoading}
          >
            {isLoading 
              ? 'Processing...' 
              : isLogin 
                ? 'Login' 
                : 'Create Account'
            }
          </Button>
        </form>
        
        <ToggleContainer>
          {isLogin ? (
            <p>Don't have an account? <ToggleLink onClick={handleToggleMode}>Sign up</ToggleLink></p>
          ) : (
            <p>Already have an account? <ToggleLink onClick={handleToggleMode}>Login</ToggleLink></p>
          )}
        </ToggleContainer>
      </FormContainer>
    </PageContainer>
  );
};