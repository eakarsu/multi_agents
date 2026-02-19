import React, { useState } from 'react';
import { Box } from '@mui/material';
import DataTable from '../DataTable/DataTable';
import DetailDialog from '../common/DetailDialog';

const statusColor = (s) => s === 'active' ? 'success' : s === 'archived' ? 'default' : 'error';

const columns = [
  { field: 'title', label: 'Title', sortable: true },
  { field: 'status', label: 'Status', chip: true, chipColor: statusColor, sortable: true },
  { field: 'message_count', label: 'Messages', sortable: true },
  { field: 'satisfaction', label: 'Satisfaction', sortable: true, render: (v) => v ? `${v}/5` : 'N/A' },
  { field: 'duration', label: 'Duration', sortable: true, render: (v) => v ? `${Math.round(v / 60)}m` : 'N/A' },
  { field: 'created_at', label: 'Created', sortable: true, render: (v) => new Date(v).toLocaleDateString() },
];

const detailFields = [
  { key: 'title', label: 'Title', dbField: 'title', editable: true },
  { key: 'status', label: 'Status', dbField: 'status', chip: true, chipColor: statusColor, editable: true, type: 'select', options: ['active', 'archived', 'deleted'] },
  { key: 'message_count', label: 'Message Count', dbField: 'message_count' },
  { key: 'last_message', label: 'Last Message', dbField: 'last_message', fullWidth: true },
  { key: 'satisfaction', label: 'Satisfaction', dbField: 'satisfaction', render: (v) => v ? `${v}/5` : 'Not rated' },
  { key: 'duration', label: 'Duration', dbField: 'duration', render: (v) => v ? `${Math.round(v / 60)} minutes` : 'N/A' },
  { key: 'agent_id', label: 'Agent ID', dbField: 'agent_id' },
  { key: 'user_id', label: 'User ID', dbField: 'user_id' },
  { key: 'created_at', label: 'Created', dbField: 'created_at', render: (v) => new Date(v).toLocaleString() },
  { key: 'updated_at', label: 'Updated', dbField: 'updated_at', render: (v) => new Date(v).toLocaleString() },
];

const filterOptions = {
  status: { label: 'Status', values: ['active', 'archived', 'deleted'] },
};

export default function ConversationsPage() {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <DataTable key={refresh} entity="conversations" columns={columns} title="Conversations" filterOptions={filterOptions}
        onRowClick={(row) => setSelected(row)} onEdit={(row) => setSelected(row)} />
      <DetailDialog open={!!selected} item={selected} entity="conversations" fields={detailFields}
        onClose={() => setSelected(null)} onUpdate={() => { setSelected(null); setRefresh(r => r + 1); }}
        onDelete={() => { setSelected(null); setRefresh(r => r + 1); }} />
    </Box>
  );
}
