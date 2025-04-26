import React from 'react';
import { Route, Redirect, Switch } from 'wouter';

import LeaderboardScreen from '/imports/ui/screens/LeaderboardScreen';
import { Event } from '/imports/schemas/event';
import HorseRaceScreen from './HorseRace/HorseRaceScreen';
import TellerScreen from './Teller/TellerScreen';
import { useTypekitFonts } from '../../hooks/use-typekit-fonts';

const DerbyRoot = ({ event }: { event: Event }) => {
  useTypekitFonts(['lqw3feh.css']);

  return (
    <Switch>
      <Route path="/race">
        <HorseRaceScreen event={event} />
      </Route>
      <Route path="/teller/:url">
        {(params) => <TellerScreen event={event} url={params.url} />}
      </Route>
      <Route path="/leaderboard">
        <LeaderboardScreen event={event} />
      </Route>
      <Redirect to="/race" />
    </Switch>
  );
};

export default DerbyRoot;
