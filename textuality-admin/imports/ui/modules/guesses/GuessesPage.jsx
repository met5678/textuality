import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import GuessesTable from './GuessesTable';

const GuessesPage = ({ match }) => {
  return (
    <>
      <h2>All Guesses</h2>
      <GuessesTable />
    </>
  );
};

export default GuessesPage;
