import React, { useState } from 'react';
import { Box } from '@mui/material';
import DataTable from '../DataTable/DataTable';
import DetailDialog from '../common/DetailDialog';

const statusColor = (s) => ({ completed: 'success', in_progress: 'info', pending: 'warning', failed: 'error', cancelled: 'default' }[s] || 'default');
const priorityColor = (p) => ({ critical: 'error', high: 'warning', medium: 'info', low: 'default' }[p] || 'default');

const columns = [
  { field: 'title', label: 'Title', sortable: true },
  { field: 'status', label: 'Status', chip: true, chipColor: statusColor, sortable: true },
  { field: 'priority', label: 'Priority', chip: true, chipColor: priorityColor, sortable: true },
  { field: 'due_date', label: 'Due Date', sortable: true, render: (v) => v ? new Date(v).toLocaleDateString() : 'No due date' },
  { field: 'created_at', label: 'Created', sortable: true, render: (v) => new Date(v).toLocaleDateString() },
];

const detailFields = [
  { key: 'title', label: 'Title', dbField: 'title', editable: true },
  { key: 'description', label: 'Description', dbField: 'description', editable: true, multiline: true, fullWidth: true },
  { key: 'status', label: 'Status', dbField: 'status', chip: true, chipColor: statusColor, editable: true, type: 'select', options: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'] },
  { key: 'priority', label: 'Priority', dbField: 'priority', chip: true, chipColor: priorityColor, editable: true, type: 'select', options: ['low', 'medium', 'high', 'critical'] },
  { key: 'due_date', label: 'Due Date', dbField: 'due_date', editable: true, render: (v) => v ? new Date(v).toLocaleDateString() : 'Not set' },
  { key: 'completed_at', label: 'Completed', dbField: 'completed_at', render: (v) => v ? new Date(v).toLocaleString() : 'Not completed' },
  { key: 'tags', label: 'Tags', dbField: 'tags', render: (v) => { try { return JSON.parse(v).join(', '); } catch { return v || 'None'; } } },
  { key: 'created_at', label: 'Created', dbField: 'created_at', render: (v) => new Date(v).toLocaleString() },
];

const filterOptions = {
  status: { label: 'Status', values: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'] },
  priority: { label: 'Priority', values: ['low', 'medium', 'high', 'critical'] },
};

export default function TasksPage() {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <DataTable key={refresh} entity="tasks" columns={columns} title="Tasks" filterOptions={filterOptions}
        onRowClick={(row) => setSelected(row)} onEdit={(row) => setSelected(row)} />
      <DetailDialog open={!!selected} item={selected} entity="tasks" fields={detailFields}
        onClose={() => setSelected(null)} onUpdate={() => { setSelected(null); setRefresh(r => r + 1); }}
        onDelete={() => { setSelected(null); setRefresh(r => r + 1); }} />
    </Box>
  );
}
