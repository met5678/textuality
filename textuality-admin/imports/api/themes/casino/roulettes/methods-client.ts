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

  'roulettes.openBets': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        bets_open: true,
        bets_started_at: new Date(),
      },
    });
  },

  'roulettes.startSpin': async (rouletteId) => {
    const roulette = Roulettes.findOne(rouletteId);
    if (!roulette) return;

    Roulettes.update(rouletteId, {
      $set: {
        status: 'spinning',
        bets_open: true,
        spin_started_at: new Date(),
      },
    });

    waitForSeconds(roulette.spin_seconds - roulette.bets_cutoff_seconds).then(
      () => {
        Meteor.call('roulettes.closeBets', rouletteId);
      },
    );
    waitForSeconds(roulette.spin_seconds).then(() => {
      Meteor.call('roulettes.finishSpin', rouletteId);
    });
  },

  'roulettes.finishSpin': async (rouletteId) => {
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

  'roulettes.closeBets': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        bets_open: false,
        bets_ended_at: new Date(),
      },
    });
  },

  'roulettes.resetRoulette': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        bets_open: false,
        status: 'inactive',
      },
      $unset: {
        spin_started_at: '',
        spin_ended_at: '',
        bets_started_at: '',
        bets_ended_at: '',
      },
    });
  },
});
