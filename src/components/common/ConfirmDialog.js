import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({ open, title = 'Confirm Action', message = 'Are you sure?', confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, severity = 'warning' }) {
  const colors = { warning: 'warning', error: 'error', info: 'primary' };
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" color={colors[severity] || 'primary'}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
