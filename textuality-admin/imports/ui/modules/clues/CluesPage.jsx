import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import CluesTable from './CluesTable';

const CluesPage = ({ match }) => {
  return (
    <>
      <h2>All Clues</h2>
      <CluesTable />
    </>
  );
};

export default CluesPage;
