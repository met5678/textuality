import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Nav from '/imports/ui/modules/Nav';
import LoadingBar from '/imports/ui/generic/LoadingBar';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loading = useTracker(() => !Meteor.subscribe('events.current').ready());

  return (
    <>
      <Container maxWidth={false} disableGutters={true}>
        <Box sx={{ display: 'flex' }}>
          <Nav />
          <Box p={3} sx={{ flexGrow: 1 }}>
            {loading ? <LoadingBar /> : children}
          </Box>
        </Box>
      </Container>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default Shell;
