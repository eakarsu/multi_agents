import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TableSortLabel, TextField, InputAdornment, IconButton, Button,
  Checkbox, Menu, MenuItem, Chip, Select, FormControl, InputLabel, Toolbar, Typography, Tooltip
} from '@mui/material';
import {
  Search, FilterList, Delete, Edit, FileDownload, SelectAll, Refresh
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import EmptyState from '../common/EmptyState';
import { TableSkeleton } from '../common/LoadingSkeleton';
import ConfirmDialog from '../common/ConfirmDialog';

export default function DataTable({
  entity, columns, title, onRowClick, onEdit, onAdd,
  filterOptions = {}, bulkActions = true, exportEnabled = true
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1, limit: rowsPerPage,
        sort: sortField, order: sortOrder,
        ...(search && { search }),
        ...filters
      };
      const result = await api.getList(entity, params);
      setData(result.data || []);
      setTotal(result.pagination?.total || 0);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [entity, page, rowsPerPage, sortField, sortOrder, search, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => { setSearch(value); setPage(0); }, 300);
    setSearchTimeout(timeout);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? data.map(r => r.id) : []);
  };

  const handleSelectOne = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    try {
      await api.bulkDelete(entity, selected);
      toast.success(`${selected.length} items deleted`);
      setSelected([]);
      fetchData();
    } catch (err) {
      toast.error('Bulk delete failed');
    }
    setConfirmDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.remove(entity, id);
      toast.success('Item deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
    setConfirmDelete(null);
  };

  const handleExport = async (format) => {
    try {
      const res = await api.exportData(entity, format);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entity}_export.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const [exportAnchor, setExportAnchor] = useState(null);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Toolbar sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', py: 2, px: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" sx={{ flex: '0 0 auto', mr: 2, display: { xs: 'none', sm: 'block' } }}>{title}</Typography>

        <TextField
          size="small" placeholder="Search..." onChange={(e) => handleSearch(e.target.value)}
          sx={{ flex: { xs: '1 1 100%', sm: '0 1 300px' } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        />

        <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto', flexWrap: 'wrap' }}>
          {Object.keys(filterOptions).length > 0 && (
            <Tooltip title="Toggle filters">
              <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'primary' : 'default'}>
                <FilterList />
              </IconButton>
            </Tooltip>
          )}

          {selected.length > 0 && bulkActions && (
            <Button size="small" color="error" startIcon={<Delete />}
              onClick={() => setConfirmDelete({ type: 'bulk', ids: selected })}>
              Delete ({selected.length})
            </Button>
          )}

          {exportEnabled && (
            <>
              <Button size="small" startIcon={<FileDownload />} onClick={(e) => setExportAnchor(e.currentTarget)}>
                Export
              </Button>
              <Menu anchorEl={exportAnchor} open={!!exportAnchor} onClose={() => setExportAnchor(null)}>
                <MenuItem onClick={() => { handleExport('csv'); setExportAnchor(null); }}>CSV</MenuItem>
                <MenuItem onClick={() => { handleExport('json'); setExportAnchor(null); }}>JSON</MenuItem>
              </Menu>
            </>
          )}

          <Tooltip title="Refresh">
            <IconButton onClick={fetchData}><Refresh /></IconButton>
          </Tooltip>

          {onAdd && <Button variant="contained" size="small" onClick={onAdd}>Add New</Button>}
        </Box>
      </Toolbar>

      {showFilters && Object.keys(filterOptions).length > 0 && (
        <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Object.entries(filterOptions).map(([key, opts]) => (
            <FormControl key={key} size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{opts.label}</InputLabel>
              <Select value={filters[key] || ''} label={opts.label}
                onChange={(e) => { setFilters(prev => ({ ...prev, [key]: e.target.value || undefined })); setPage(0); }}>
                <MenuItem value="">All</MenuItem>
                {opts.values.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </Select>
            </FormControl>
          ))}
          <Button size="small" onClick={() => { setFilters({}); setPage(0); }}>Clear Filters</Button>
        </Box>
      )}

      {loading ? <TableSkeleton rows={rowsPerPage} columns={columns.length} /> : data.length === 0 ? (
        <EmptyState title={`No ${title} found`} description={search ? 'Try a different search term' : 'No items to display'} />
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {bulkActions && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={data.length > 0 && selected.length === data.length}
                        indeterminate={selected.length > 0 && selected.length < data.length}
                        onChange={handleSelectAll} />
                    </TableCell>
                  )}
                  {columns.map(col => (
                    <TableCell key={col.field} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {col.sortable !== false ? (
                        <TableSortLabel active={sortField === col.field}
                          direction={sortField === col.field ? sortOrder : 'asc'}
                          onClick={() => handleSort(col.field)}>
                          {col.label}
                        </TableSortLabel>
                      ) : col.label}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(row => (
                  <TableRow key={row.id} hover sx={{ cursor: 'pointer' }}
                    onClick={() => onRowClick && onRowClick(row)}
                    selected={selected.includes(row.id)}>
                    {bulkActions && (
                      <TableCell padding="checkbox" onClick={e => e.stopPropagation()}>
                        <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                      </TableCell>
                    )}
                    {columns.map(col => (
                      <TableCell key={col.field}>
                        {col.render ? col.render(row[col.field], row) : (
                          col.chip ? <Chip label={row[col.field]} size="small" color={col.chipColor?.(row[col.field]) || 'default'} /> :
                          String(row[col.field] ?? '')
                        )}
                      </TableCell>
                    ))}
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => onEdit(row)}><Edit fontSize="small" /></IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setConfirmDelete({ type: 'single', id: row.id })}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div" count={total} page={page} rowsPerPage={rowsPerPage}
            onPageChange={(e, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Confirmation"
        message={confirmDelete?.type === 'bulk'
          ? `Are you sure you want to delete ${confirmDelete?.ids?.length} selected items? This action cannot be undone.`
          : 'Are you sure you want to delete this item? This action cannot be undone.'}
        severity="error"
        confirmLabel="Delete"
        onConfirm={() => confirmDelete?.type === 'bulk' ? handleBulkDelete() : handleDelete(confirmDelete?.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </Paper>
  );
}
