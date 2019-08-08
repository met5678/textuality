import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import AchievementsTable from './AchievementsTable';

const AchievementsPage = ({ match }) => {
  return (
    <>
      <h2>All Achievements</h2>
      <AchievementsTable />
    </>
  );
};

export default AchievementsPage;
