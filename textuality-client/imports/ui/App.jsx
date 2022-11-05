import React from 'react';
import {
  withTracker,
  useSubscribe,
  useTracker,
} from 'meteor/react-meteor-data';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Shell from './Shell';
import Screen from './Screen';
import ScreenPortrait from './ScreenPortrait';
import ScreenAchievements from './ScreenAchievements';

import Events from 'api/events';
import Rounds from 'api/rounds';
// import Screens from 'api/sreens';

const App = () => {
  const isLoadingEvent = useSubscribe('events.current');
  const isLoadingRound = useSubscribe('rounds.current');
  const event = useTracker(() => Events.current());
  const round = useTracker(() => Rounds.current());

  if (isLoadingEvent() || isLoadingRound()) {
    return null;
  }

  console.log({ event, round });

  return (
    <BrowserRouter>
      <Shell>
        <Switch>
          <Route
            path="/portrait"
            render={() => <ScreenPortrait event={event} />}
          />
          <Route
            path="/achievements"
            render={() => <ScreenAchievements event={event} />}
          />{' '}
          <Route
            path="/"
            render={() => <Screen event={event} round={round} />}
          />
        </Switch>
      </Shell>
    </BrowserRouter>
  );
};

export default App;
