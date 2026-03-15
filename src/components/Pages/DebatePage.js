import React from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import { Forum as ForumIcon } from '@mui/icons-material';
import DebateDemo from '../Demo/DebateDemo';

const DebatePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">AI Debate Arena</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <ForumIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            AI Debate Arena
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Watch multiple AI agents debate topics from different perspectives with a moderator summary
          </Typography>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, minHeight: 700 }}>
        <DebateDemo />
      </Paper>
    </Box>
  );
};

export default DebatePage;
