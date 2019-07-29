import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Shell from './Shell';
import Screen from './Screen';

const App = () => (
  <BrowserRouter>
    <Shell>
      <Switch>
        <Route path="/" component={Screen} />
      </Switch>
    </Shell>
  </BrowserRouter>
);

export default App;
