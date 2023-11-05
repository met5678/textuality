import React from 'react';

// import MediaTable from './MediaTable';
import MediaList from './MediaList';
import { Box, Typography } from '@mui/material';

const MediaPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Media</Typography>
      </Box>
      <MediaList />
    </>
  );
};

export default MediaPage;
