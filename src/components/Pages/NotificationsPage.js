import React, { useState } from 'react';
import { Box, Chip } from '@mui/material';
import DataTable from '../DataTable/DataTable';
import DetailDialog from '../common/DetailDialog';

const typeColor = (t) => ({ info: 'info', warning: 'warning', error: 'error', success: 'success' }[t] || 'default');

const columns = [
  { field: 'title', label: 'Title', sortable: true },
  { field: 'type', label: 'Type', chip: true, chipColor: typeColor, sortable: true },
  { field: 'is_read', label: 'Read', sortable: true, render: (v) => v ? 'Yes' : 'No' },
  { field: 'created_at', label: 'Created', sortable: true, render: (v) => new Date(v).toLocaleDateString() },
];

const detailFields = [
  { key: 'title', label: 'Title', dbField: 'title' },
  { key: 'message', label: 'Message', dbField: 'message', fullWidth: true },
  { key: 'type', label: 'Type', dbField: 'type', chip: true, chipColor: typeColor },
  { key: 'is_read', label: 'Read', dbField: 'is_read', render: (v) => v ? 'Yes' : 'No' },
  { key: 'link', label: 'Link', dbField: 'link', render: (v) => v || 'None' },
  { key: 'user_id', label: 'User ID', dbField: 'user_id' },
  { key: 'created_at', label: 'Created', dbField: 'created_at', render: (v) => new Date(v).toLocaleString() },
];

const filterOptions = {
  type: { label: 'Type', values: ['info', 'warning', 'error', 'success'] },
  is_read: { label: 'Read Status', values: ['0', '1'] },
};

export default function NotificationsPage() {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <DataTable key={refresh} entity="notifications" columns={columns} title="Notifications" filterOptions={filterOptions}
        onRowClick={(row) => setSelected(row)} onEdit={(row) => setSelected(row)} />
      <DetailDialog open={!!selected} item={selected} entity="notifications" fields={detailFields}
        onClose={() => setSelected(null)} onUpdate={() => { setSelected(null); setRefresh(r => r + 1); }}
        onDelete={() => { setSelected(null); setRefresh(r => r + 1); }} />
    </Box>
  );
}
