import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    if (!password) return 'Password is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 440 }}>
        <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>CraftAgent Pro</Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Sign in to your account</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }} InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />
          <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={password}
            onChange={e => setPassword(e.target.value)} sx={{ mb: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
            }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Typography variant="body2" component={Link} to="/forgot-password" sx={{ color: 'primary.main', textDecoration: 'none' }}>
              Forgot password?
            </Typography>
          </Box>

          <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ py: 1.5, mb: 2 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Typography variant="body2" align="center" color="text.secondary">
          Don&apos;t have an account? <Typography component={Link} to="/register" variant="body2" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>Sign up</Typography>
        </Typography>

        <Alert severity="info" sx={{ mt: 3, fontSize: '0.75rem' }}>
          Demo: admin@craftagent.com / Password1!
        </Alert>
      </Paper>
    </Box>
  );
}
