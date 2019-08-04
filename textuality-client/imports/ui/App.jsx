import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Shell from './Shell';
import Screen from './Screen';

import Events from 'api/events';
// import Screens from 'api/sreens';

const App = ({ loading, event }) => {
  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <Shell>
        <Switch>
          <Route path="/" render={() => <Screen event={event} />} />
        </Switch>
      </Shell>
    </BrowserRouter>
  );
};

export default withTracker(() => {
  const handles = [Meteor.subscribe('events.current')];

  return {
    loading: handles.some(handle => !handle.ready()),
    event: Events.current()
  };
})(App);
