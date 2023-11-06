import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Route, Redirect, Switch } from 'wouter';

import Shell from './Shell';

import Events from '/imports/api/events';
import SlotMachineScreen from './screens/SlotMachineScreen';
import RouletteScreen from './screens/RouletteScreen';

const App = () => {
  const isLoadingEvent = useSubscribe('events.current');
  const event = useTracker(() => Events.current());

  if (isLoadingEvent()) {
    return <p>Loading</p>;
  }

  if (!event) {
    return <p>No Event</p>;
  }

  return (
    <Shell>
      Hi! how are you
      <Switch>
        <Route path="/slot-machine/:code">
          {(params) => (
            <SlotMachineScreen event={event} slotMachineCode={params.code} />
          )}
        </Route>
        <Route path="/roulette">
          <RouletteScreen event={event} />
        </Route>

        <Redirect to="/roulette" />
      </Switch>
    </Shell>
  );
};

export default App;
