import { Meteor } from 'meteor/meteor';
import Roulettes from './roulettes';
import waitForSeconds from '/imports/api/rounds/reveal-sequence/_wait-for-seconds';
import Events from '/imports/api/events';

Meteor.methods({
  'roulettes.findCurrent': () => {
    return Roulettes.findOne({
      event: Events.currentId()!,
      status: { $ne: 'inactive' },
    });
  },

  'roulette.openBets': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        bets_open: true,
        bets_started_at: new Date(),
      },
    });
  },

  'roulette.startSpin': async (rouletteId) => {
    const roulette = Roulettes.findOne(rouletteId);
    if (!roulette) return;

    Roulettes.update(rouletteId, {
      $set: {
        status: 'spinning',
        spin_started_at: new Date(),
      },
    });

    waitForSeconds(roulette.spin_seconds - roulette.bets_cutoff_seconds).then(
      () => {
        Meteor.call('roulette.closeBets', rouletteId);
      },
    );
    waitForSeconds(roulette.spin_seconds).then(() => {
      Meteor.call('roulette.finishSpin', rouletteId);
    });
  },

  'roulette.finishSpin': async (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        status: 'end-spin',
        spin_ended_at: new Date(),
      },
    });

    await waitForSeconds(10);

    Roulettes.update(rouletteId, {
      $set: {
        status: 'winners-board',
      },
    });

    await waitForSeconds(30);

    Roulettes.update(rouletteId, {
      $set: {
        status: 'inactive',
      },
    });
  },

  'roulette.closeBets': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        bets_open: false,
        bets_ended_at: new Date(),
      },
    });
  },
});
