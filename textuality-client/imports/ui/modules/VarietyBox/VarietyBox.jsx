import React from 'react';

import AchievementsBox from '../AchievementsBox';
import Leaderboard from '../Leaderboard';

const VarietyBox = () => {
  return (
    <div className="varietyBox">
      <div className="varietyBox-clueLogo">
        <div className="varietyBox-clueLogo-text">
          C<span className="red">l</span>ue
        </div>
      </div>
      <AchievementsBox />
    </div>
  );
};

export default VarietyBox;
