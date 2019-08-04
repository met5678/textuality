import React from 'react';

import Header from 'modules/Header';
import Feed from 'modules/Feed';
import Host from 'modules/Host';

const Screen = ({ event }) => (
  <div className="screen">
    <Header event={event} />
    <Feed event={event} />
    <Host />
  </div>
);

export default Screen;
