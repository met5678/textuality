import React from 'react';
import { Route, Redirect, Switch } from 'wouter';

import { Event } from '/imports/schemas/event';
import HorseRaceScreen from './HorseRace/HorseRaceScreen';
import TellerScreen from './Teller/TellerScreen';
import { useTypekitFonts } from '../../hooks/use-typekit-fonts';
import LeaderboardScreen from './Leaderboard/LeaderboardScreen';
import { FinaleScreen } from './Finale/FinaleScreen';

const DerbyRoot = ({ event }: { event: Event }) => {
  useTypekitFonts(['lqw3feh.css']);

  return (
    <Switch>
      <Route path="/race">
        {event.state === 'finale' ? (
          <FinaleScreen event={event} />
        ) : (
          <HorseRaceScreen event={event} />
        )}
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
