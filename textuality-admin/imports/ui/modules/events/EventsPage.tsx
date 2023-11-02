import React from 'react';

import EventsTable from './EventsTable';
import { Box, Typography } from '@mui/material';

const EventsPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Events</Typography>
      </Box>
      <EventsTable />
    </>
  );
};

export default EventsPage;
