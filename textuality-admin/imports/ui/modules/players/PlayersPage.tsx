import React from 'react';

import PlayersTable from './PlayersTable';
import { Box, Typography } from '@mui/material';

const PlayersPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Events</Typography>
      </Box>
      <PlayersTable />
    </>
  );
};

export default PlayersPage;
