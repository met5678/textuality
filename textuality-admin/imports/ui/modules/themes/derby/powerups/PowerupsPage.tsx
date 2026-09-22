import React from 'react';

import { Box, Typography } from '@mui/material';
import PowerupsTable from './PowerupsTable';

const PowerupsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Powerups</Typography>
      </Box>
      <PowerupsTable />
    </>
  );
};

export default PowerupsPage;
