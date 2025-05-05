import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Meteor } from 'meteor/meteor';

interface BroadcastTextDialogProps {
  open: boolean;
  onClose: () => void;
}

const BroadcastTextDialog: React.FC<BroadcastTextDialogProps> = ({
  open,
  onClose,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;

    setIsSending(true);
    setError(null);
    setSuccess(false);

    Meteor.call(
      'autoTexts.sendBroadcastCustom',
      { playerText: message, source: 'broadcast' },
      (err: Error | null, result: any) => {
        setIsSending(false);

        if (err) {
          setError(err.message || 'Failed to send broadcast message');
          return;
        }

        setSuccess(true);
        setMessage('');
        // Close dialog after 2 seconds on success
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      },
    );
  };

  const handleClose = () => {
    setMessage('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Broadcast Text to All Players</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Message sent successfully!
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSending}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSending}>
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          color="primary"
          disabled={!message.trim() || isSending}
          startIcon={isSending ? <CircularProgress size={20} /> : null}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BroadcastTextDialog;
