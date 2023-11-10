import React from 'react';

import MissionsTable from './MissionsTable';
import { Box, Typography } from '@mui/material';

const MissionsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Roulettes</Typography>
      </Box>
      <MissionsTable />
    </>
  );
};

export default MissionsPage;
