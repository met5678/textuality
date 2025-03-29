import React from 'react';

import { Box, Typography } from '@mui/material';
import RacesTable from './RacesTable';

const RacesPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Races</Typography>
      </Box>
      <RacesTable />
    </>
  );
};

export default RacesPage;
