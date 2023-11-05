import React from 'react';

import SlotMachinesTable from './SlotMachinesTable';
import { Box, Typography } from '@mui/material';

const SlotMachinesPage = () => {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">All Slot Machines</Typography>
      </Box>
      <SlotMachinesTable />
    </>
  );
};

export default SlotMachinesPage;
