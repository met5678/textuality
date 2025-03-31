import React from 'react';
import { Route, Redirect, Switch } from 'wouter';

import { Event } from '/imports/schemas/event';
import { useTypekitFonts } from '../../hooks/use-typekit-fonts';

const ClueRoot = ({ event }: { event: Event }) => {
  useTypekitFonts(['aht0oew.css']);

  return (
    <Switch>
      <Route path="/main">{/* <ClueMainScreen event={event} /> */}</Route>
      <Route path="/achievements">
        {/* <ClueAchievementsScreen event={event} /> */}
      </Route>
      <Redirect to="/main" />
    </Switch>
  );
};

export default ClueRoot;
