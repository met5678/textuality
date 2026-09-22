import React from 'react';

import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import TellersTable from './TellersTable';

const TellersPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Tellers</Typography>
      </Box>
      <TellersTable />
    </>
  );
};

export default TellersPage;
