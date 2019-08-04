import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import AliasesList from './AliasesList';
import AliasForm from './AliasForm';
import AliasActions from './AliasActions';

const AliasesPage = ({ match }) => {
  return (
    <Container>
      <Row>
        <Col xs="12" sm="8" lg="9">
          <h2>All Aliases</h2>
          <hr />
          <AliasesList />
        </Col>
        <Col xs="12" sm="4" lg="3">
          <h2>Add Alias</h2>
          <AliasForm />
          <hr />
          <AliasActions />
        </Col>
      </Row>
    </Container>
  );
};

export default AliasesPage;
