import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
  Chip, IconButton, Divider, TextField, Grid
} from '@mui/material';
import { Close, Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import ConfirmDialog from './ConfirmDialog';

export default function DetailDialog({ open, onClose, item, entity, fields, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEdit = () => {
    const initial = {};
    fields.filter(f => f.editable).forEach(f => { initial[f.key] = item[f.dbField || f.key]; });
    setEditData(initial);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await api.update(entity, item.id, editData);
      toast.success('Updated successfully');
      setEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.remove(entity, item.id);
      toast.success('Deleted successfully');
      setConfirmDelete(false);
      if (onDelete) onDelete();
      onClose();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {editing ? `Edit ${entity.slice(0, -1)}` : `${entity.slice(0, -1).charAt(0).toUpperCase() + entity.slice(1, -1)} Details`}
          </Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {editing ? (
            <Grid container spacing={2}>
              {fields.filter(f => f.editable).map(f => (
                <Grid item xs={12} sm={f.fullWidth ? 12 : 6} key={f.key}>
                  {f.type === 'select' ? (
                    <TextField select fullWidth label={f.label} value={editData[f.key] || ''} size="small"
                      onChange={(e) => setEditData(prev => ({ ...prev, [f.key]: e.target.value }))}>
                      {f.options.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </TextField>
                  ) : (
                    <TextField fullWidth label={f.label} value={editData[f.key] || ''} size="small"
                      multiline={f.multiline} rows={f.multiline ? 3 : 1}
                      onChange={(e) => setEditData(prev => ({ ...prev, [f.key]: e.target.value }))} />
                  )}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fields.map(f => (
                <Box key={f.key} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 600 }}>
                    {f.label}:
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {f.chip ? (
                      <Chip label={item[f.dbField || f.key] ?? 'N/A'} size="small" color={f.chipColor?.(item[f.dbField || f.key]) || 'default'} />
                    ) : f.render ? f.render(item[f.dbField || f.key], item) : (
                      String(item[f.dbField || f.key] ?? 'N/A')
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          {editing ? (
            <>
              <Button startIcon={<Cancel />} onClick={() => setEditing(false)}>Cancel</Button>
              <Button variant="contained" startIcon={<Save />} onClick={handleSave}>Save</Button>
            </>
          ) : (
            <>
              <Button color="error" startIcon={<Delete />} onClick={() => setConfirmDelete(true)}>Delete</Button>
              <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}>Edit</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={confirmDelete} title="Delete Confirmation" severity="error"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setConfirmDelete(false)} />
    </>
  );
}
