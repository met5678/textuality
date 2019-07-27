import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Row, Col } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Nav from 'modules/Nav';
import LoadingBar from 'generic/LoadingBar';

const Shell = ({ children, loading }) => (
  <>
    <Nav />
    <Container fluid>
      <Row>
        <Col xs="12">{loading ? <LoadingBar /> : children}</Col>
      </Row>
    </Container>
    <ToastContainer position="bottom-center" />
  </>
);

export default withTracker(() => {
  // const handles = [Meteor.subscribe('globals.all')];

  // return {
  //   loading: handles.some(handle => !handle.ready)
  // };

  return {};
})(Shell);
