import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  Security
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(2),
}));

const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 420,
  width: '100%',
  borderRadius: 16,
  background: 'white',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.06)',
  border: '1px solid rgba(0, 0, 0, 0.04)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9',
      borderColor: '#cbd5e1',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#3b82f6',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: '#1e293b',
    padding: '16px 14px',
    fontWeight: 500,
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px #f8fafc inset',
      WebkitTextFillColor: '#1e293b',
      caretColor: '#1e293b',
    },
    '&:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 100px #f1f5f9 inset',
      WebkitTextFillColor: '#1e293b',
    },
    '&:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 100px white inset',
      WebkitTextFillColor: '#1e293b',
    },
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '14px 0',
  fontSize: '1rem',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
  },
  '&:disabled': {
    background: '#94a3b8',
    boxShadow: 'none',
  },
}));

const CredentialsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#f8fafc',
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  textAlign: 'center',
}));

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <LoginContainer maxWidth={false}>
      <LoginCard>
        <CardContent sx={{ p: 5 }}>
          {/* Header */}
          <Stack alignItems="center" spacing={3} mb={4}>
            <Box 
              sx={{ 
                p: 2.5, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)'
              }}
            >
              <Security sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="700" color="#1e293b" mb={1}>
                Modbus Gateway
              </Typography>
              <Typography variant="body1" color="#64748b" fontWeight={500}>
                Industrial Control System
              </Typography>
            </Box>
          </Stack>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                '& .MuiAlert-icon': {
                  color: '#dc2626'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <StyledTextField
                fullWidth
                label="Username"
                variant="outlined"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  )
                }}
                required
              />
              
              <StyledTextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ color: '#94a3b8' }}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                required
              />

              <LoginButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </LoginButton>
            </Stack>
          </Box>

          {/* <CredentialsBox sx={{ mt: 4 }}>
            <Typography variant="caption" color="#64748b" display="block" mb={1}>
              Development Credentials
            </Typography>
            <Typography variant="body2" color="#475569" fontWeight={500}>
              <strong>Username:</strong> admin • <strong>Password:</strong> admin
            </Typography>
          </CredentialsBox> */}
        </CardContent>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;