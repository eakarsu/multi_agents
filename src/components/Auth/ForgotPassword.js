import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';
import api from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 440 }}>
        <Typography variant="h5" align="center" sx={{ mb: 1, fontWeight: 700 }}>Reset Password</Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Enter your email and we'll send you a reset link
        </Typography>

        {sent ? (
          <Alert severity="success">If an account exists with that email, a reset link has been sent. Check your inbox.</Alert>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />
              <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ py: 1.5, mb: 2 }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        )}

        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
          <Typography component={Link} to="/login" variant="body2" sx={{ color: 'primary.main', textDecoration: 'none' }}>Back to login</Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
