import React, { useState } from 'react';
import { Box } from '@mui/material';
import DataTable from '../DataTable/DataTable';
import DetailDialog from '../common/DetailDialog';

const statusColor = (s) => s === 'active' ? 'success' : s === 'training' ? 'warning' : 'default';
const typeColor = (t) => t === 'craft' ? 'primary' : t === 'custom' ? 'secondary' : t === 'industry' ? 'info' : 'default';

const columns = [
  { field: 'name', label: 'Name', sortable: true },
  { field: 'type', label: 'Type', chip: true, chipColor: typeColor, sortable: true },
  { field: 'category', label: 'Category', sortable: true },
  { field: 'status', label: 'Status', chip: true, chipColor: statusColor, sortable: true },
  { field: 'provider', label: 'Provider', sortable: true },
  { field: 'total_conversations', label: 'Conversations', sortable: true },
  { field: 'success_rate', label: 'Success %', sortable: true, render: (v) => v ? `${v}%` : 'N/A' },
];

const detailFields = [
  { key: 'name', label: 'Name', dbField: 'name', editable: true },
  { key: 'type', label: 'Type', dbField: 'type', chip: true, chipColor: typeColor, editable: true, type: 'select', options: ['craft', 'custom', 'industry', 'department'] },
  { key: 'category', label: 'Category', dbField: 'category', editable: true },
  { key: 'description', label: 'Description', dbField: 'description', editable: true, multiline: true, fullWidth: true },
  { key: 'status', label: 'Status', dbField: 'status', chip: true, chipColor: statusColor, editable: true, type: 'select', options: ['active', 'inactive', 'training'] },
  { key: 'provider', label: 'Provider', dbField: 'provider', editable: true },
  { key: 'model', label: 'Model', dbField: 'model', editable: true },
  { key: 'total_conversations', label: 'Total Conversations', dbField: 'total_conversations' },
  { key: 'success_rate', label: 'Success Rate', dbField: 'success_rate', render: (v) => v ? `${v}%` : 'N/A' },
  { key: 'avg_response_time', label: 'Avg Response Time', dbField: 'avg_response_time', render: (v) => v ? `${v}s` : 'N/A' },
  { key: 'created_at', label: 'Created', dbField: 'created_at', render: (v) => new Date(v).toLocaleString() },
];

const filterOptions = {
  type: { label: 'Type', values: ['craft', 'custom', 'industry', 'department'] },
  status: { label: 'Status', values: ['active', 'inactive', 'training'] },
  provider: { label: 'Provider', values: ['anthropic', 'openai'] },
};

export default function AgentsPage() {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <DataTable key={refresh} entity="agents" columns={columns} title="Agents" filterOptions={filterOptions}
        onRowClick={(row) => setSelected(row)} onEdit={(row) => setSelected(row)} />
      <DetailDialog open={!!selected} item={selected} entity="agents" fields={detailFields}
        onClose={() => setSelected(null)} onUpdate={() => { setSelected(null); setRefresh(r => r + 1); }}
        onDelete={() => { setSelected(null); setRefresh(r => r + 1); }} />
    </Box>
  );
}
