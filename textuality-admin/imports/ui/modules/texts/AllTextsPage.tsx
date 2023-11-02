import React from 'react';
import AllTextsTable from './AllTextsTable';
import { Box, Typography } from '@mui/material';

const AllTextsPage: React.FC = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Texts</Typography>
      </Box>
      <AllTextsTable />
    </>
  );
};

export default AllTextsPage;
