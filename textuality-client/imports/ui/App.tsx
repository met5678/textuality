import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import Events from '/imports/api/events';
import CasinoRoot from './themes/casino/CasinoRoot';
import DerbyRoot from './themes/derby/DerbyRoot';
import ClueRoot from './themes/clue/ClueRoot';
import { EventTheme } from '../schemas/event';
import { Event } from '../schemas/event';

const ROOT_SCREEN_BY_THEME: Record<
  EventTheme,
  React.ComponentType<{ event: Event }>
> = {
  casino: CasinoRoot,
  derby: DerbyRoot,
  clue: ClueRoot,
};

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
  const ThemeScreenComponent = ROOT_SCREEN_BY_THEME[theme];

  if (!ThemeScreenComponent) {
    return <p>No Theme Screen Component for theme: "{theme}"</p>;
  }

  return <ThemeScreenComponent event={event} />;
};

export default App;
