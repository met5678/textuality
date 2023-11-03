import React from 'react';

import AutoTextsTable from './AutoTextsTable';
import AutoTextsInventory from './AutoTextsInventory';
import { Box, Paper, Typography } from '@mui/material';

const AutoTextsPage = () => {
  return (
    <Box display="flex" flexDirection="row">
      <Box flexGrow={1}>
        <Box mb={2}>
          <Typography variant="h5">AutoTexts</Typography>
        </Box>
        <AutoTextsTable />
      </Box>
      <Box minWidth={200} ml={2}>
        <Box mb={2}>
          <Typography variant="h6">Unfilled AutoTexts</Typography>
        </Box>
        <Paper>
          <AutoTextsInventory />
        </Paper>
      </Box>
    </Box>
  );
};

export default AutoTextsPage;
