import React from 'react';

import { Box, Typography } from '@mui/material';
import RaceBetsTable from './RaceBetsTable';

const RaceBetsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Race Bets</Typography>
      </Box>
      <RaceBetsTable />
    </>
  );
};

export default RaceBetsPage;
