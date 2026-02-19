import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Chip
} from '@mui/material';
import {
  People, SmartToy, Assignment, Description, Chat, Assessment,
  Extension, Notifications as NotifIcon
} from '@mui/icons-material';
import api from '../../utils/api';
import { CardSkeleton } from '../common/LoadingSkeleton';

const menuCards = [
  { key: 'users', label: 'Users', icon: People, color: '#6750A4', path: '/users', description: 'Manage user accounts, roles, and permissions' },
  { key: 'agents', label: 'Agents', icon: SmartToy, color: '#7D5260', path: '/agents', description: 'Configure and monitor AI agents' },
  { key: 'tasks', label: 'Tasks', icon: Assignment, color: '#625B71', path: '/tasks', description: 'Track and manage agent tasks' },
  { key: 'templates', label: 'Templates', icon: Description, color: '#4F378B', path: '/templates', description: 'Browse and create agent templates' },
  { key: 'conversations', label: 'Conversations', icon: Chat, color: '#633B48', path: '/conversations', description: 'View conversation history' },
  { key: 'reports', label: 'Reports', icon: Assessment, color: '#4A4458', path: '/reports', description: 'Analytics and performance reports' },
  { key: 'integrations', label: 'Integrations', icon: Extension, color: '#7D5260', path: '/integrations', description: 'Connected services and APIs' },
  { key: 'notifications', label: 'Notifications', icon: NotifIcon, color: '#6750A4', path: '/notifications', description: 'Alerts and system notifications' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const entities = ['users', 'agents', 'tasks', 'templates', 'conversations', 'reports', 'integrations', 'notifications'];
        const results = await Promise.allSettled(
          entities.map(e => api.getList(e, { limit: 1 }))
        );
        const c = {};
        entities.forEach((e, i) => {
          c[e] = results[i].status === 'fulfilled' ? results[i].value.pagination?.total || 0 : 0;
        });
        setCounts(c);
      } catch (err) {
        console.error('Failed to load counts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCounts();
  }, []);

  if (loading) return <Box sx={{ p: 3 }}><CardSkeleton count={8} /></Box>;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>Dashboard</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to CraftAgent Pro. Select a section to manage.
      </Typography>

      <Grid container spacing={3}>
        {menuCards.map(card => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={card.key}>
              <Paper
                onClick={() => navigate(card.path)}
                sx={{
                  p: 3, cursor: 'pointer', transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                  display: 'flex', flexDirection: 'column', height: '100%', minHeight: 180,
                  borderTop: `4px solid ${card.color}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${card.color}15` }}>
                    <Icon sx={{ fontSize: 28, color: card.color }} />
                  </Box>
                  <Chip label={counts[card.key] ?? 0} size="small" sx={{ bgcolor: `${card.color}20`, color: card.color, fontWeight: 700, fontSize: '1rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{card.label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{card.description}</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
