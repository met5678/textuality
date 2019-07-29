import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Shell from './Shell';

import AllTextsPage from 'modules/texts/AllTextsPage';
import PlayersPage from 'modules/players/PlayersPage';
import EventsPage from 'modules/events/EventsPage';

const App = () => (
  <BrowserRouter>
    <Shell>
      <Switch>
        <Route path="/texts" component={AllTextsPage} />
        <Route path="/players" component={PlayersPage} />
        <Route path="/events" component={EventsPage} />

        {/*<Redirect from="/" to="/texts" />*/}
      </Switch>
    </Shell>
  </BrowserRouter>
);

export default App;
