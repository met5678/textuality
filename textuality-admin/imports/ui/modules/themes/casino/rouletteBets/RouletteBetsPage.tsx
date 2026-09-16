import React from 'react';

import { Box, Typography } from '@mui/material';
import RouletteBetsTable from './RouletteBetsTable';

const RouletteBetsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Roulette Bets</Typography>
      </Box>
      <RouletteBetsTable />
    </>
  );
};

export default RouletteBetsPage;
