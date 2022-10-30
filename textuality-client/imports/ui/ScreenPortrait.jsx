import React from 'react';

import Header from 'modules/Header';
import Feed from 'modules/Feed';
import Host from 'modules/Host';
import BottomBar from 'modules/BottomBar';
import VarietyBox from 'modules/VarietyBox';
import MissionOverlay from 'modules/MissionOverlay';

const ScreenPortrait = ({ event }) => (
  <div className="screen screenPortrait">
    <Header event={event} />
    <div className="lowerArea">
      <div className="leftColumn">
        <Feed event={event} />
        <BottomBar event={event} />
      </div>
    </div>

    <MissionOverlay />
  </div>
);

export default ScreenPortrait;
