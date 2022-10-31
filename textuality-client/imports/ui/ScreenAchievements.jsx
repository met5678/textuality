import React from 'react';

import Header from 'modules/Header';
import Feed from 'modules/Feed';
import Host from 'modules/Host';
import BottomBar from 'modules/BottomBar';
import VarietyBox from 'modules/VarietyBox';
import MissionOverlay from 'modules/MissionOverlay';

const ScreenAchievements = ({ event }) => (
  <div className="screen screenAchievements">
    <div className="lowerArea">
      <VarietyBox event={event} />
    </div>
    <MissionOverlay />
  </div>
);

export default ScreenAchievements;
