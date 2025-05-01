import React from 'react';

import { Box, Typography } from '@mui/material';
import FortunesTable from './FortunesTable';

const FortunesPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Fortunes</Typography>
      </Box>
      <FortunesTable />
    </>
  );
};

export default FortunesPage;
