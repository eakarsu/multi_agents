import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, InputAdornment, IconButton, LinearProgress } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, Phone } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
  return { score, max: 6, label: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong', color: score <= 2 ? 'error' : score <= 4 ? 'warning' : 'success' };
}

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '', department: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(form.password);

  const validateField = (name, value) => {
    switch (name) {
      case 'email': return !value ? 'Required' : !/\S+@\S+\.\S+/.test(value) ? 'Invalid email' : '';
      case 'firstName': return !value ? 'Required' : '';
      case 'lastName': return !value ? 'Required' : '';
      case 'password':
        if (!value) return 'Required';
        if (value.length < 8) return 'Min 8 characters';
        if (!/[A-Z]/.test(value)) return 'Need uppercase letter';
        if (!/[a-z]/.test(value)) return 'Need lowercase letter';
        if (!/[0-9]/.test(value)) return 'Need a number';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Need special character';
        return '';
      case 'confirmPassword': return value !== form.password ? 'Passwords don\'t match' : '';
      default: return '';
    }
  };

  const handleBlur = (name) => {
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, form[name]) }));
  };

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    ['email', 'password', 'confirmPassword', 'firstName', 'lastName'].forEach(f => {
      errors[f] = validateField(f, form[f]);
    });
    setFieldErrors(errors);
    if (Object.values(errors).some(e => e)) return;

    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || err.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>Create Account</Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Join CraftAgent Pro</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="First Name" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')} error={!!fieldErrors.firstName} helperText={fieldErrors.firstName}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} />
            <TextField fullWidth label="Last Name" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')} error={!!fieldErrors.lastName} helperText={fieldErrors.lastName} />
          </Box>

          <TextField fullWidth label="Email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')} error={!!fieldErrors.email} helperText={fieldErrors.email} sx={{ mb: 2 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />

          <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={form.password}
            onChange={e => handleChange('password', e.target.value)} onBlur={() => handleBlur('password')}
            error={!!fieldErrors.password} helperText={fieldErrors.password} sx={{ mb: 0.5 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
            }} />
          {form.password && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={(strength.score / strength.max) * 100} color={strength.color} sx={{ height: 6, borderRadius: 3 }} />
              <Typography variant="caption" color={`${strength.color}.main`}>{strength.label}</Typography>
            </Box>
          )}

          <TextField fullWidth label="Confirm Password" type="password" value={form.confirmPassword}
            onChange={e => handleChange('confirmPassword', e.target.value)} onBlur={() => handleBlur('confirmPassword')}
            error={!!fieldErrors.confirmPassword} helperText={fieldErrors.confirmPassword} sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Phone (optional)" value={form.phone} onChange={e => handleChange('phone', e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }} />
            <TextField fullWidth label="Department (optional)" value={form.department} onChange={e => handleChange('department', e.target.value)} />
          </Box>

          <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ py: 1.5, mb: 2 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <Typography variant="body2" align="center" color="text.secondary">
          Already have an account? <Typography component={Link} to="/login" variant="body2" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>Sign in</Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
