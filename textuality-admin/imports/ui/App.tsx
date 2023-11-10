import React from 'react';
import { Switch, Route, Redirect } from 'wouter';

import Shell from './Shell';

import EventsPage from '/imports/ui/modules/events/EventsPage';
import AllTextsPage from '/imports/ui/modules/texts/AllTextsPage';
import PlayersPage from '/imports/ui/modules/players/PlayersPage';
import MediaPage from '/imports/ui/modules/media/MediaPage';
import AchievementsPage from '/imports/ui/modules/achievements/AchievementsPage';
// import ClueRewardsPage from 'modules/clueRewards/ClueRewardsPage';
// import GuessesPage from 'modules/guesses/GuessesPage';
import AliasesPage from '/imports/ui/modules/aliases/AliasesPage';
import AutoTextsPage from '/imports/ui/modules/autoTexts/AutoTextsPage';
import CheckpointsPage from '/imports/ui/modules/checkpoints/CheckpointsPage';
import MissionsPage from '/imports/ui/modules/missions/MissionsPage';
// import CluesPage from 'modules/clues/CluesPage';
// import RoundsPage from 'modules/rounds/RoundsPage';
import SlotMachinesPage from './modules/themes/casino/slotMachines/SlotMachinesPage';
import RoulettesPage from './modules/themes/casino/roulettes/RoulettesPage';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import QuestsPage from './modules/themes/casino/quests/QuestsPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <CssBaseline />

      <Shell>
        <Switch>
          <Route path="/texts" component={AllTextsPage} />
          <Route path="/players" component={PlayersPage} />
          <Route path="/media" component={MediaPage} />
          {/*<Route path="/unlocks" component={AchievementUnlocksPage} />*/}
          <Route path="/achievements" component={AchievementsPage} />
          <Route path="/aliases" component={AliasesPage} />
          <Route path="/autoTexts" component={AutoTextsPage} />
          <Route path="/checkpoints" component={CheckpointsPage} />
          <Route path="/missions" component={MissionsPage} />
          <Route path="/casino/slot-machines" component={SlotMachinesPage} />
          <Route path="/casino/roulettes" component={RoulettesPage} />
          <Route path="/casino/quests" component={QuestsPage} />

          {/*<Route path="/clue-rewards" component={ClueRewardsPage} />*/}
          {/*<Route path="/clues" component={CluesPage} />*/}
          {/*<Route path="/guesses" component={GuessesPage} />*/}
          {/*<Route path="/rounds" component={RoundsPage} />*/}

          <Route path="/events" component={EventsPage} />
          <Redirect to="/events" />
        </Switch>
      </Shell>
    </LocalizationProvider>{' '}
  </ThemeProvider>
);

export default App;
