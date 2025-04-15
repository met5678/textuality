import React, { useState } from 'react';
import { Alert } from '@mui/material';

import { Snackbar } from '@mui/material';

const TableErrorSnackbar = ({
  message,
  open,
  onClose,
}: {
  message: string;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Alert
        onClose={onClose}
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export const useTableErrorSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleOpen = (message: string) => {
    setOpen(true);
    setMessage(message);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderSnackbar = () => (
    <TableErrorSnackbar open={open} onClose={handleClose} message={message} />
  );

  return {
    openSnackbar: handleOpen,
    renderSnackbar,
  };
};
