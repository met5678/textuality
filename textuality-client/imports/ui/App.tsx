import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import Events from '/imports/api/events';
import CasinoRoot from './themes/casino/CasinoRoot';
import DerbyRoot from './themes/derby/DerbyRoot';

const App = () => {
  const isLoadingEvent = useSubscribe('events.current');
  const event = useTracker(() => Events.current());

  if (isLoadingEvent()) {
    return <p>Loading</p>;
  }

  if (!event) {
    return <p>No Event</p>;
  }

  const theme = event.theme;

  if (theme === 'casino') {
    return <CasinoRoot event={event} />;
  }

  if (theme === 'derby') {
    return <DerbyRoot event={event} />;
  }
};

export default App;
