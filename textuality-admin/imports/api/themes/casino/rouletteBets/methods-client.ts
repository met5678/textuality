import { Meteor } from 'meteor/meteor';

import RouletteBets from './rouletteBets';

import './methods/rouletteBet.doClassicBet';

Meteor.methods({
  'rouletteBets.clearBets': (roulette_id: string) => {
    RouletteBets.removeAsync({ roulette_id });
  },
});
