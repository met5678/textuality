import React from 'react';
import { Route, Redirect, Switch } from 'wouter';

import SlotMachineScreen from '/imports/ui/screens/SlotMachineScreen';
import RouletteScreen from '/imports/ui/screens/RouletteScreen';
import LeaderboardScreen from '/imports/ui/screens/LeaderboardScreen';
import FinaleOverlay from '/imports/ui/modules/CasinoFinale/FinaleOverlay';
import GlitchOverlay from '/imports/ui/modules/CasinoFinale/GlitchOverlay';
import { Event } from '/imports/schemas/event';

const CasinoRoot = ({ event }: { event: Event }) => {
  return (
    <Switch>
      <Route path="/slot-machine/:code">
        {(params) => (
          <>
            <SlotMachineScreen event={event} slotMachineCode={params.code} />
            {event.state === 'finale' && event.skin === 'normal' && (
              <GlitchOverlay />
            )}
          </>
        )}
      </Route>
      <Route path="/roulette">
        <RouletteScreen event={event} />
        {event.state === 'finale' && <FinaleOverlay event={event} />}
      </Route>
      <Route path="/leaderboard">
        <LeaderboardScreen event={event} />
        {event.state === 'finale' && event.skin === 'normal' && (
          <GlitchOverlay />
        )}
      </Route>

      <Redirect to="/roulette" />
    </Switch>
  );
};

export default CasinoRoot;
