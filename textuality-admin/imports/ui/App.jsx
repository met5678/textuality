import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Shell from './Shell';

import AllTextsPage from 'modules/texts/AllTextsPage';
import PlayersPage from 'modules/players/PlayersPage';
import EventsPage from 'modules/events/EventsPage';
import AliasesPage from 'modules/aliases/AliasesPage';
import AutoTextsPage from 'modules/autoTexts/AutoTextsPage';

const App = () => (
  <BrowserRouter>
    <Shell>
      <Switch>
        <Route path="/texts" component={AllTextsPage} />
        <Route path="/players" component={PlayersPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/aliases" component={AliasesPage} />
        <Route path="/autoTexts" component={AutoTextsPage} />

        {/*<Redirect from="/" to="/texts" />*/}
      </Switch>
    </Shell>
  </BrowserRouter>
);

export default App;
