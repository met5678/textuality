import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { ReactNode } from 'react';

interface AlertDialogProps {
  open: boolean;
  title?: ReactNode;
  text?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const AlertDialog = ({
  open,
  title = 'Are you sure?',
  text,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onCancel,
  onConfirm,
}: AlertDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {text && (
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onConfirm}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
