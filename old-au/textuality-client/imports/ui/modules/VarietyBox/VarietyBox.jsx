import React from 'react';

import AchievementsBox from '../AchievementsBox';
import Leaderboard from '../Leaderboard';

const VarietyBox = () => {
  return (
    <div className="varietyBox">
      <Leaderboard />
      <AchievementsBox />
    </div>
  );
};

export default VarietyBox;
