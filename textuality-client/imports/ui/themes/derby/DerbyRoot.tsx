import React from 'react';
import { Route, Redirect, Switch } from 'wouter';

import LeaderboardScreen from '/imports/ui/screens/LeaderboardScreen';
import { Event } from '/imports/schemas/event';
import HorseRaceScreen from './HorseRace/HorseRaceScreen';
import TellerScreen from './Teller/TellerScreen';
import PaddockTaskScreen from './PaddockTask/PaddockTaskScreen';

const DerbyRoot = ({ event }: { event: Event }) => {
  return (
    <Switch>
      <Route path="/race">
        <HorseRaceScreen event={event} />
      </Route>
      <Route path="/teller/:url">
        {(params) => <TellerScreen event={event} url={params.url} />}
      </Route>
      <Route path="/task/:url">
        {(params) => <PaddockTaskScreen event={event} url={params.url} />}
      </Route>
      <Route path="/leaderboard">
        <LeaderboardScreen event={event} />
      </Route>
      <Redirect to="/race" />
    </Switch>
  );
};

export default DerbyRoot;
