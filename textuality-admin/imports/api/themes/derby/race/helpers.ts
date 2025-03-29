import Races from './races';

Races.helpers({
  isActive() {
    const activeStatuses = [
      'bets-open',
      'race-intro',
      'race-in-progress',
      'race-photo-finish',
      'race-results',
      'race-bet-winners',
    ];
    return activeStatuses.includes(this.status);
  },
});
