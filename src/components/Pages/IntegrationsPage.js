import React, { useState } from 'react';
import { Box } from '@mui/material';
import DataTable from '../DataTable/DataTable';
import DetailDialog from '../common/DetailDialog';

const statusColor = (s) => ({ connected: 'success', disconnected: 'default', error: 'error', pending: 'warning' }[s] || 'default');
const typeColor = (t) => ({ crm: 'primary', email: 'info', chat: 'secondary', analytics: 'success', storage: 'warning', payment: 'error' }[t] || 'default');

const columns = [
  { field: 'name', label: 'Name', sortable: true },
  { field: 'type', label: 'Type', chip: true, chipColor: typeColor, sortable: true },
  { field: 'provider', label: 'Provider', sortable: true },
  { field: 'status', label: 'Status', chip: true, chipColor: statusColor, sortable: true },
  { field: 'last_sync', label: 'Last Sync', sortable: true, render: (v) => v ? new Date(v).toLocaleString() : 'Never' },
];

const detailFields = [
  { key: 'name', label: 'Name', dbField: 'name', editable: true },
  { key: 'type', label: 'Type', dbField: 'type', chip: true, chipColor: typeColor, editable: true, type: 'select', options: ['crm', 'email', 'chat', 'analytics', 'storage', 'payment'] },
  { key: 'provider', label: 'Provider', dbField: 'provider', editable: true },
  { key: 'status', label: 'Status', dbField: 'status', chip: true, chipColor: statusColor, editable: true, type: 'select', options: ['connected', 'disconnected', 'error', 'pending'] },
  { key: 'config', label: 'Configuration', dbField: 'config', fullWidth: true, render: (v) => { try { return JSON.stringify(JSON.parse(v), null, 2); } catch { return v || 'None'; } } },
  { key: 'last_sync', label: 'Last Sync', dbField: 'last_sync', render: (v) => v ? new Date(v).toLocaleString() : 'Never' },
  { key: 'created_at', label: 'Created', dbField: 'created_at', render: (v) => new Date(v).toLocaleString() },
];

const filterOptions = {
  type: { label: 'Type', values: ['crm', 'email', 'chat', 'analytics', 'storage', 'payment'] },
  status: { label: 'Status', values: ['connected', 'disconnected', 'error', 'pending'] },
};

export default function IntegrationsPage() {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <DataTable key={refresh} entity="integrations" columns={columns} title="Integrations" filterOptions={filterOptions}
        onRowClick={(row) => setSelected(row)} onEdit={(row) => setSelected(row)} />
      <DetailDialog open={!!selected} item={selected} entity="integrations" fields={detailFields}
        onClose={() => setSelected(null)} onUpdate={() => { setSelected(null); setRefresh(r => r + 1); }}
        onDelete={() => { setSelected(null); setRefresh(r => r + 1); }} />
    </Box>
  );
}
