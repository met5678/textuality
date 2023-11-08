import { Meteor } from 'meteor/meteor';

import Roulettes from './roulettes';
import Events from '/imports/api/events';

Meteor.methods({
  'roulettes.new': (roulette) => {
    const id = Roulettes.insert(roulette);
    return id;
  },

  'roulettes.update': (roulette) => {
    Roulettes.update(roulette._id, { $set: roulette });
  },

  'roulettes.delete': (rouletteId) => {
    if (Array.isArray(rouletteId)) {
      Roulettes.remove({ _id: { $in: rouletteId } });
    } else {
      Roulettes.remove(rouletteId);
    }
  },

  'roulettes.resetEvent': (event_id) => {
    Roulettes.update(
      { event: event_id },
      {
        $set: {
          stats: {
            profit: 0,
            spin_count: 0,
          },
        },
        $unset: {
          player: 1,
          result: 1,
          win_amount: 1,
        },
      },
      { multi: true },
    );
  },

  'roulettes.copyOddsToAll': (odds) => {
    Roulettes.update(
      { event: Events.currentId()! },
      {
        $set: {
          odds,
        },
      },
      { multi: true },
    );
  },
});
