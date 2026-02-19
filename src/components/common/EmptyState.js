import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

export default function EmptyState({ title = 'No data found', description = 'There are no items to display.', actionLabel, onAction, icon: Icon = InboxOutlined }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, px: 2 }}>
      <Icon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>{description}</Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>{actionLabel}</Button>
      )}
    </Box>
  );
}
