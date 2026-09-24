import React from 'react';
import { Route, Redirect, Switch } from 'wouter';

import LeaderboardScreen from '/imports/ui/screens/LeaderboardScreen';
import FinaleOverlay from '/imports/ui/modules/CasinoFinale/FinaleOverlay';
import GlitchOverlay from '/imports/ui/modules/CasinoFinale/GlitchOverlay';
import { Event, EventSkin } from '/imports/schemas/event';
import SlotMachineScreen from './SlotMachine/SlotMachineScreen';
import RouletteScreen from './Roulette/RouletteScreen';
import { useTypekitFonts } from '../../hooks/use-typekit-fonts';
import { getThemeVars } from './CasinoThemeConfig';

const fontCssFilesBySkin: Record<EventSkin, string[]> = {
  normal: ['lod8mlk.css'],
  space: ['lod8mlk.css', 'erv7vdo.css'],
};

const CasinoRoot = ({ event }: { event: Event }) => {
  useTypekitFonts(fontCssFilesBySkin[event.skin] || fontCssFilesBySkin.normal);
  const themeVars = getThemeVars(event.skin);

  return (
    <div style={themeVars}>
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
    </div>
  );
};

export default CasinoRoot;
