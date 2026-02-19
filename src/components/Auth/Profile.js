import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, Grid, Chip, Avatar, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    api.getProfile().then(data => {
      setProfileData(data);
      setForm({ firstName: data.firstName || '', lastName: data.lastName || '', phone: data.phone || '', department: data.department || '' });
    }).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) return toast.error('Name is required');
    setLoading(true);
    try {
      const result = await api.updateProfile(form);
      toast.success('Profile updated');
      setUser(prev => ({ ...prev, firstName: form.firstName, lastName: form.lastName }));
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Profile & Settings</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}>
              {form.firstName?.[0]}{form.lastName?.[0]}
            </Avatar>
            <Typography variant="h6">{form.firstName} {form.lastName}</Typography>
            <Typography variant="body2" color="text.secondary">{profileData?.email}</Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Chip label={profileData?.role || 'user'} color="primary" size="small" />
              <Chip label={profileData?.isEmailVerified ? 'Verified' : 'Unverified'}
                color={profileData?.isEmailVerified ? 'success' : 'warning'} size="small" />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Joined: {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last login: {profileData?.lastLogin ? new Date(profileData.lastLogin).toLocaleString() : 'N/A'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Edit Profile</Typography>
            <form onSubmit={handleSave}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" value={form.firstName}
                    onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" value={form.lastName}
                    onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Department" value={form.department}
                    onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
