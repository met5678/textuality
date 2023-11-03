import React from 'react';
import InTextsTable from './InTextsTable';
import OutTextsTable from './OutTextsTable';
import { Box, Typography } from '@mui/material';

const AllTextsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Texts</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant="h6">Incoming Texts</Typography>
        <InTextsTable />
      </Box>
      <Box mb={2}>
        <Typography variant="h6">Outgoing Texts</Typography>
        <OutTextsTable />
      </Box>
    </>
  );
};

export default AllTextsPage;
