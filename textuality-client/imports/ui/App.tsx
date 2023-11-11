import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Route, Redirect, Switch } from 'wouter';

import Shell from './Shell';

import Events from '/imports/api/events';
import SlotMachineScreen from './screens/SlotMachineScreen';
import RouletteScreen from './screens/RouletteScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import FinaleOverlay from './modules/CasinoFinale/FinaleOverlay';

const App = () => {
  const isLoadingEvent = useSubscribe('events.current');
  const event = useTracker(() => Events.current());

  if (isLoadingEvent()) {
    return <p>Loading</p>;
  }

  if (!event) {
    return <p>No Event</p>;
  }

  console.log({ state: event.state, finale_data: event.finale_data });

  return (
    <Shell>
      <Switch>
        <Route path="/slot-machine/:code">
          {(params) => (
            <SlotMachineScreen event={event} slotMachineCode={params.code} />
          )}
        </Route>
        <Route path="/roulette">
          <RouletteScreen event={event} />
          {event.state === 'finale' && <FinaleOverlay event={event} />}
        </Route>
        <Route path="/leaderboard">
          <LeaderboardScreen event={event} />
        </Route>

        <Redirect to="/roulette" />
      </Switch>
    </Shell>
  );
};

export default App;
