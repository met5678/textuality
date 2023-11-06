import React from 'react';

import CheckpointsTable from './CheckpointsTable';
import { Box, Typography } from '@mui/material';

const CheckpointsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Checkpoints</Typography>
      </Box>
      <CheckpointsTable />
    </>
  );
};

export default CheckpointsPage;
