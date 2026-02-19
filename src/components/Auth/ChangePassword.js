import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++; if (pw.length >= 12) s++; if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) s++;
  return { score: s, max: 6, color: s <= 2 ? 'error' : s <= 4 ? 'warning' : 'success', label: s <= 2 ? 'Weak' : s <= 4 ? 'Medium' : 'Strong' };
}

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = getStrength(form.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword) return setError('All fields required');
    if (form.newPassword !== form.confirmPassword) return setError('Passwords don\'t match');
    if (form.newPassword.length < 8) return setError('Min 8 characters');
    setError('');
    setLoading(true);
    try {
      await api.changePassword(form.currentPassword, form.newPassword);
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.error || err.errors?.[0]?.msg || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Change Password</Typography>
      <Paper sx={{ p: 3, maxWidth: 500 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Current Password" type="password" value={form.currentPassword}
            onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))} sx={{ mb: 2 }} />
          <TextField fullWidth label="New Password" type="password" value={form.newPassword}
            onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))} sx={{ mb: 0.5 }} />
          {form.newPassword && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={(strength.score / strength.max) * 100} color={strength.color} sx={{ height: 6, borderRadius: 3 }} />
              <Typography variant="caption" color={`${strength.color}.main`}>{strength.label}</Typography>
            </Box>
          )}
          <TextField fullWidth label="Confirm New Password" type="password" value={form.confirmPassword}
            onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} sx={{ mb: 3 }} />
          <Button variant="contained" type="submit" disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</Button>
        </form>
      </Paper>
    </Box>
  );
}
