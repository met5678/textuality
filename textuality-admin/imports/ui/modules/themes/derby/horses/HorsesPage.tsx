import React from 'react';

import { Box, Typography } from '@mui/material';
import HorsesTable from './HorsesTable';

const HorsesPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Horses</Typography>
      </Box>
      <HorsesTable />
    </>
  );
};

export default HorsesPage; 