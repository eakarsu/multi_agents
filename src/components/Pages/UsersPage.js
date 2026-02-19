import React, { useState } from 'react';
import { Box, Chip } from '@mui/material';
import DataTable from '../DataTable/DataTable';
import DetailDialog from '../common/DetailDialog';

const statusColor = (s) => s === 'active' ? 'success' : s === 'suspended' ? 'error' : 'default';
const roleColor = (r) => r === 'admin' ? 'error' : r === 'manager' ? 'warning' : r === 'user' ? 'primary' : 'default';

const columns = [
  { field: 'email', label: 'Email', sortable: true },
  { field: 'first_name', label: 'First Name', sortable: true },
  { field: 'last_name', label: 'Last Name', sortable: true },
  { field: 'role', label: 'Role', chip: true, chipColor: roleColor, sortable: true },
  { field: 'department', label: 'Department', sortable: true },
  { field: 'status', label: 'Status', chip: true, chipColor: statusColor, sortable: true },
];

const detailFields = [
  { key: 'email', label: 'Email', dbField: 'email', editable: false },
  { key: 'first_name', label: 'First Name', dbField: 'first_name', editable: true },
  { key: 'last_name', label: 'Last Name', dbField: 'last_name', editable: true },
  { key: 'role', label: 'Role', dbField: 'role', chip: true, chipColor: roleColor, editable: true, type: 'select', options: ['admin', 'manager', 'user', 'viewer'] },
  { key: 'department', label: 'Department', dbField: 'department', editable: true },
  { key: 'phone', label: 'Phone', dbField: 'phone', editable: true },
  { key: 'status', label: 'Status', dbField: 'status', chip: true, chipColor: statusColor, editable: true, type: 'select', options: ['active', 'inactive', 'suspended'] },
  { key: 'is_email_verified', label: 'Email Verified', dbField: 'is_email_verified', render: (v) => v ? 'Yes' : 'No' },
  { key: 'last_login', label: 'Last Login', dbField: 'last_login', render: (v) => v ? new Date(v).toLocaleString() : 'Never' },
  { key: 'created_at', label: 'Created', dbField: 'created_at', render: (v) => new Date(v).toLocaleString() },
];

const filterOptions = {
  role: { label: 'Role', values: ['admin', 'manager', 'user', 'viewer'] },
  status: { label: 'Status', values: ['active', 'inactive', 'suspended'] },
  department: { label: 'Department', values: ['Engineering', 'Product', 'Marketing', 'Sales', 'Support', 'HR', 'Finance', 'Operations', 'Legal'] },
};

export default function UsersPage() {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <DataTable key={refresh} entity="users" columns={columns} title="Users" filterOptions={filterOptions}
        onRowClick={(row) => setSelected(row)} onEdit={(row) => setSelected(row)} />
      <DetailDialog open={!!selected} item={selected} entity="users" fields={detailFields}
        onClose={() => setSelected(null)} onUpdate={() => { setSelected(null); setRefresh(r => r + 1); }}
        onDelete={() => { setSelected(null); setRefresh(r => r + 1); }} />
    </Box>
  );
}
