import React from 'react';

import AchievementsTable from './AchievementsTable';
import { Box, Typography } from '@mui/material';

const AchievementsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Achievements</Typography>
      </Box>
      <AchievementsTable />
    </>
  );
};

export default AchievementsPage;
