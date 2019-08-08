import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import MediaTable from './MediaTable';

const MediaPage = ({ match }) => {
  return (
    <>
      <h2>All Media</h2>
      <MediaTable />
    </>
  );
};

export default MediaPage;
