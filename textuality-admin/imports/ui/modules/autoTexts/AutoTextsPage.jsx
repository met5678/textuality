import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import AutoTextsTable from './AutoTextsTable';
import AutoTextsInventory from './AutoTextsInventory';

const AutoTextsPage = ({ match }) => {
  return (
    <Row>
      <Col xs="12" sm="9">
        <h2>All AutoTexts</h2>
        <AutoTextsTable />
      </Col>
      <Col xs="12" sm="3">
        <AutoTextsInventory />
      </Col>
    </Row>
  );
};

export default AutoTextsPage;
