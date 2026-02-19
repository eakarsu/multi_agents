import React, { useState } from 'react';
import { Box } from '@mui/material';
import DataTable from '../DataTable/DataTable';
import DetailDialog from '../common/DetailDialog';

const columns = [
  { field: 'name', label: 'Name', sortable: true },
  { field: 'category', label: 'Category', sortable: true },
  { field: 'agent_type', label: 'Agent Type', chip: true, sortable: true },
  { field: 'usage_count', label: 'Usage', sortable: true },
  { field: 'rating', label: 'Rating', sortable: true, render: (v) => v ? `${v}/5` : 'N/A' },
  { field: 'is_public', label: 'Public', sortable: true, render: (v) => v ? 'Yes' : 'No' },
];

const detailFields = [
  { key: 'name', label: 'Name', dbField: 'name', editable: true },
  { key: 'description', label: 'Description', dbField: 'description', editable: true, multiline: true, fullWidth: true },
  { key: 'category', label: 'Category', dbField: 'category', editable: true },
  { key: 'agent_type', label: 'Agent Type', dbField: 'agent_type', editable: true, type: 'select', options: ['craft', 'custom', 'industry', 'department'] },
  { key: 'system_prompt', label: 'System Prompt', dbField: 'system_prompt', editable: true, multiline: true, fullWidth: true },
  { key: 'sample_tasks', label: 'Sample Tasks', dbField: 'sample_tasks', render: (v) => { try { return JSON.parse(v).join(', '); } catch { return v || 'None'; } } },
  { key: 'usage_count', label: 'Usage Count', dbField: 'usage_count' },
  { key: 'rating', label: 'Rating', dbField: 'rating', render: (v) => v ? `${v}/5` : 'N/A' },
  { key: 'created_at', label: 'Created', dbField: 'created_at', render: (v) => new Date(v).toLocaleString() },
];

const filterOptions = {
  agent_type: { label: 'Agent Type', values: ['craft', 'custom', 'industry', 'department'] },
  category: { label: 'Category', values: ['Support', 'Marketing', 'Analytics', 'Engineering', 'Sales', 'Human Resources', 'Healthcare', 'Finance', 'Retail', 'Operations', 'Legal', 'Research', 'Education'] },
};

export default function TemplatesPage() {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <DataTable key={refresh} entity="templates" columns={columns} title="Templates" filterOptions={filterOptions}
        onRowClick={(row) => setSelected(row)} onEdit={(row) => setSelected(row)} />
      <DetailDialog open={!!selected} item={selected} entity="templates" fields={detailFields}
        onClose={() => setSelected(null)} onUpdate={() => { setSelected(null); setRefresh(r => r + 1); }}
        onDelete={() => { setSelected(null); setRefresh(r => r + 1); }} />
    </Box>
  );
}
