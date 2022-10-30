import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import MissionsTable from './MissionsTable';

const MissionsPage = ({ match }) => {
  return (
    <>
      <h2>All Missions</h2>
      <MissionsTable />
    </>
  );
};

export default MissionsPage;
