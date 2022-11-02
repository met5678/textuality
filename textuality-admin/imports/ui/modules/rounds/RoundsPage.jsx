import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import RoundsTable from './RoundsTable';

const RoundsPage = ({ match }) => {
  return (
    <>
      <h2>All Rounds</h2>
      <RoundsTable />
    </>
  );
};

export default RoundsPage;
