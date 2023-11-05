import React from 'react';

import AliasesList from './AliasesList';
import AliasForm from './AliasForm';
import AliasActions from './AliasActions';
import { Box, Divider, Paper, Typography } from '@mui/material';

const AliasesPage = () => {
  return (
    <Box display="flex" flexDirection="row">
      <Box flexGrow={1}>
        <Box mb={2}>
          <Typography variant="h5">Aliases</Typography>
        </Box>
        <AliasesList />
      </Box>
      <Box minWidth={250} ml={2}>
        <Box mb={2}>
          <Typography variant="h6">Tools</Typography>
        </Box>
        <Paper>
          <Box p={2}>
            <AliasForm />
            <Divider />
            <AliasActions />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AliasesPage;
