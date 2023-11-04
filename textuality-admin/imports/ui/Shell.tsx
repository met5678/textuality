import React from 'react';
import { useSubscribe } from 'meteor/react-meteor-data';
import { Container, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Nav from '/imports/ui/modules/Nav';
import LoadingBar from '/imports/ui/generic/LoadingBar';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoading = useSubscribe('events.current');

  return (
    <>
      <Container maxWidth={false} disableGutters={true}>
        <Box sx={{ display: 'flex' }}>
          <Nav />
          <Box px={3} py={2} sx={{ flexGrow: 1 }}>
            {isLoading() ? <LoadingBar /> : children}
          </Box>
        </Box>
      </Container>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default Shell;
