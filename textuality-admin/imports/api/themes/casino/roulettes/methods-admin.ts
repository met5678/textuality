import { Meteor } from 'meteor/meteor';

import Roulettes from './roulettes';
import Events from '/imports/api/events';
import { Roulette } from '/imports/schemas/roulette';

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

  'roulettes.copyMultiplesToAll': ({
    number_payout_multiplier,
    special_payout_multiplier,
  }: Partial<Roulette>) => {
    if (
      typeof number_payout_multiplier !== 'number' ||
      typeof special_payout_multiplier !== 'number'
    )
      return;

    Roulettes.update(
      { event: Events.currentId()! },
      {
        $set: {
          number_payout_multiplier,
          special_payout_multiplier,
        },
      },
      { multi: true },
    );
  },

  'roulettes.resetRoulette': (rouletteId) => {
    const roulette = Roulettes.findOne(rouletteId);

    Roulettes.update(rouletteId, {
      $set: {
        bets_open: false,
        status: 'inactive',
      },
      $unset: {
        result: 1,
      },
    });

    if (!roulette?.scheduled) {
      Roulettes.update(rouletteId, {
        $unset: {
          bets_start_at: 1,
          spin_starts_at: 1,
        },
      });
    }

    Meteor.call('rouletteBets.clearBets', rouletteId);
  },
});
