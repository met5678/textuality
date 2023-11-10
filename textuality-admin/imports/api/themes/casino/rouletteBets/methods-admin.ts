import { Meteor } from 'meteor/meteor';

import RouletteBets from './rouletteBets';

Meteor.methods({
  'rouletteBets.update': (rouletteBet) => {
    RouletteBets.update(rouletteBet._id, {
      $set: rouletteBet,
    });
  },

  'rouletteBets.delete': (rouletteBetId) => {
    if (Array.isArray(rouletteBetId)) {
      RouletteBets.remove({ _id: { $in: rouletteBetId } });
    } else {
      RouletteBets.remove(rouletteBetId);
    }
  },

  'rouletteBets.clearRouletteBets': (roulette_id: string) => {
    RouletteBets.remove({ roulette_id });
  },

  'rouletteBets.resetEvent': (event_id: string) => {
    RouletteBets.remove({ event: event_id });
  },
});
