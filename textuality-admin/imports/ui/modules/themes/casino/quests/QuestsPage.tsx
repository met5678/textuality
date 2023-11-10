import React from 'react';

import QuestsTable from './QuestsTable';
import { Box, Typography } from '@mui/material';

const QuestsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Quests</Typography>
      </Box>
      <QuestsTable />
    </>
  );
};

export default QuestsPage;
