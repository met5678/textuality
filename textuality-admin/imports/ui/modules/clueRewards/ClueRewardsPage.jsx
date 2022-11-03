import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import ClueRewardsTable from './ClueRewardsTable';

const ClueRewardsPage = ({ match }) => {
  return (
    <>
      <h2>All Clue Rewards</h2>
      <ClueRewardsTable />
    </>
  );
};

export default ClueRewardsPage;
