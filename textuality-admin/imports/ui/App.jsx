import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Shell from './Shell';

import AllTextsPage from 'modules/texts/AllTextsPage';
import MediaPage from 'modules/media/MediaPage';
import AchievementUnlocksPage from 'modules/achievementUnlocks/AchievementUnlocksPage';
import ClueRewardsPage from 'modules/clueRewards/ClueRewardsPage';
import PlayersPage from 'modules/players/PlayersPage';
import EventsPage from 'modules/events/EventsPage';
import AliasesPage from 'modules/aliases/AliasesPage';
import AutoTextsPage from 'modules/autoTexts/AutoTextsPage';
import CheckpointsPage from 'modules/checkpoints/CheckpointsPage';
import AchievementsPage from 'modules/achievements/AchievementsPage';
import MissionsPage from 'modules/missions/MissionsPage';
import CluesPage from 'modules/clues/CluesPage';
import RoundsPage from 'modules/rounds/RoundsPage';

const App = () => (
  <BrowserRouter>
    <Shell>
      <Switch>
        <Route path="/texts" component={AllTextsPage} />
        <Route path="/media" component={MediaPage} />
        <Route path="/unlocks" component={AchievementUnlocksPage} />
        <Route path="/clue-rewards" component={ClueRewardsPage} />
        <Route path="/players" component={PlayersPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/aliases" component={AliasesPage} />
        <Route path="/autoTexts" component={AutoTextsPage} />
        <Route path="/checkpoints" component={CheckpointsPage} />
        <Route path="/achievements" component={AchievementsPage} />
        <Route path="/missions" component={MissionsPage} />
        <Route path="/clues" component={CluesPage} />
        <Route path="/rounds" component={RoundsPage} />

        <Redirect from="/" to="/texts" />
      </Switch>
    </Shell>
  </BrowserRouter>
);

export default App;
