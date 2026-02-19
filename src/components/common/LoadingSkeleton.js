import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
      {[...Array(rows)].map((_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          <Skeleton variant="rectangular" width={20} height={20} />
          {[...Array(columns)].map((_, j) => (
            <Skeleton key={j} variant="text" sx={{ flex: 1 }} height={24} />
          ))}
        </Box>
      ))}
    </Paper>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
      {[...Array(count)].map((_, i) => (
        <Paper key={i} sx={{ p: 3 }}>
          <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={28} width="60%" />
          <Skeleton variant="text" height={20} width="40%" />
          <Skeleton variant="text" height={36} sx={{ mt: 2 }} />
        </Paper>
      ))}
    </Box>
  );
}

export function DetailSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" height={36} width="40%" sx={{ mb: 2 }} />
      {[...Array(6)].map((_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" sx={{ flex: 1 }} height={24} />
        </Box>
      ))}
    </Box>
  );
}
