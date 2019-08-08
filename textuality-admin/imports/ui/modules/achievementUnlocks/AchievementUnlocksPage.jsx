import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import AchievementUnlocksTable from './AchievementUnlocksTable';

const AchievementUnlocksPage = ({ match }) => {
  return (
    <>
      <h2>All Achievement Unlocks</h2>
      <AchievementUnlocksTable />
    </>
  );
};

export default AchievementUnlocksPage;
