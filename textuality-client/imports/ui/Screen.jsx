import React from 'react';

import Header from 'modules/Header';
import Feed from 'modules/Feed';
import Host from 'modules/Host';
import BottomBar from 'modules/BottomBar';
import VarietyBox from 'modules/VarietyBox';

const Screen = ({ event }) => (
  <div className="screen">
    <Header event={event} />
    <div className="lowerArea">
      <div className="leftColumn">
        <Feed event={event} />
        <BottomBar event={event} />
      </div>
      <div className="rightColumn">
        <VarietyBox event={event} />
        <Host event={event} />
      </div>
    </div>
  </div>
);

export default Screen;
