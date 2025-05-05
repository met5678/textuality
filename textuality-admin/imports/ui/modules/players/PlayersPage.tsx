import React, { useState } from 'react';

import PlayersTable from './PlayersTable';
import { Box, Typography, Button } from '@mui/material';
import BroadcastTextDialog from './BroadcastTextDialog';

const PlayersPage = () => {
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);

  return (
    <>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5">All Events</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setBroadcastDialogOpen(true)}
        >
          Broadcast Text
        </Button>
      </Box>
      <PlayersTable />
      <BroadcastTextDialog
        open={broadcastDialogOpen}
        onClose={() => setBroadcastDialogOpen(false)}
      />
    </>
  );
};

export default PlayersPage;
