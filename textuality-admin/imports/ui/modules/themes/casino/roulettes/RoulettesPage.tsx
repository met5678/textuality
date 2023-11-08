import React from 'react';

import RoulettesTable from './RoulettesTable';
import { Box, Typography } from '@mui/material';

const RoulettesPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Roulettes</Typography>
      </Box>
      <RoulettesTable />
    </>
  );
};

export default RoulettesPage;
