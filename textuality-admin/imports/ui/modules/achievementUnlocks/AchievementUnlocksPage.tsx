import React from 'react';

import AchievementUnlocksTable from './AchievementUnlocksTable';
import { Box, Typography } from '@mui/material';

const AchievementUnlocksPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Unlocks</Typography>
      </Box>
      <AchievementUnlocksTable />
    </>
  );
};

export default AchievementUnlocksPage;
