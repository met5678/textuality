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
// import Screens from 'api/sreens';

const App = () => {
  const isLoading = useSubscribe('events.current');
  const event = useTracker(() => Events.current());

  if (isLoading()) {
    return null;
  }

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
          <Route path="/" render={() => <Screen event={event} />} />
        </Switch>
      </Shell>
    </BrowserRouter>
  );
};

export default App;
