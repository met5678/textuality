import React from 'react';

import Header from 'modules/Header';
import Feed from 'modules/Feed';
import Tips from 'modules/Tips';
import Host from 'modules/Host';
import BottomBar from 'modules/BottomBar';
import VarietyBox from 'modules/VarietyBox';
import MissionOverlay from 'modules/MissionOverlay';
import RevealOverlay from 'modules/RevealOverlay';

const Screen = ({ event, round }) => (
  <div className="screen">
    <Header event={event} />
    <div className="lowerArea">
      <div className="leftColumn">
        {round?.status === 'complete' ? (
          <Feed event={event} />
        ) : (
          <Tips event={event} />
        )}
        <BottomBar event={event} />
      </div>
      <div className="rightColumn">
        <VarietyBox event={event} />
        <Host event={event} />
      </div>
    </div>

    <MissionOverlay />
    {/* <RevealOverlay /> */}
  </div>
);

export default Screen;
