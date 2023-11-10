import { Meteor } from 'meteor/meteor';
import Roulettes from './roulettes';
import waitForSeconds from '/imports/api/rounds/reveal-sequence/_wait-for-seconds';
import Events from '/imports/api/events';
import { DateTime } from 'luxon';
import Players from '/imports/api/players';
import generateHackerClue from './hacker-clues/generate-hacker-clue';

Meteor.methods({
  'roulettes.findCurrent': () => {
    return Roulettes.findOne({
      event: Events.currentId()!,
      status: { $ne: 'inactive' },
    });
  },

  'roulettes.findNext': () => {
    return Roulettes.findOne(
      {
        event: Events.currentId()!,
        bets_start_at: { $gt: new Date() },
      },
      {
        sort: { bets_start_at: 1 },
        limit: 1,
      },
    );
  },

  'roulettes.openBets': (rouletteId) => {
    const roulette = Roulettes.findOne(rouletteId);

    if (!roulette) return;

    // Commenting this conditional out -- we'll randomize
    // the bets each time
    // if (
    //   typeof roulette.result !== 'number' ||
    //   roulette.result < 0 ||
    //   roulette.result > 36
    // ) {
    Roulettes.update(rouletteId, {
      $set: {
        result: Math.floor(Math.random() * 37),
      },
    });
    // }

    if (!roulette.scheduled) {
      Roulettes.update(rouletteId, {
        $set: {
          bets_open: true,
          status: 'pre-spin',
          bets_start_at: new Date(),
          spin_starts_at: DateTime.local().plus({ minutes: 5 }).toJSDate(),
        },
      });
    } else {
      Roulettes.update(rouletteId, {
        $set: {
          bets_open: true,
          status: 'pre-spin',
        },
      });
    }

    if (roulette?.linked_mission && roulette?.linked_mission !== 'none') {
      console.log('Starting mission associated with roulette');
    }
  },

  'roulettes.startSpin': (rouletteId) => {
    const roulette = Roulettes.findOne(rouletteId);
    if (!roulette) return;

    if (!roulette.bets_open) {
      Meteor.call('roulettes.openBets', rouletteId);
    }

    Roulettes.update(rouletteId, {
      $set: {
        status: 'spinning',
        bets_open: true,
      },
    });
  },

  'roulettes.finishSpin': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        status: 'end-spin',
        bets_open: false,
      },
    });
    Meteor.call('rouletteBets.doPayouts', rouletteId);
  },

  'roulettes.revealWinners': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        status: 'winners-board',
      },
    });
  },

  'roulettes.closeBets': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        bets_open: false,
      },
    });
  },

  'roulettes.deactivateRoulette': (rouletteId) => {
    Roulettes.update(rouletteId, {
      $set: {
        bets_open: false,
        status: 'inactive',
      },
    });
  },

  'roulettes.sendHackerClue': ({ missionId, playerId }) => {
    const roulette = Roulettes.findOne({
      linked_mission: missionId,
    });

    const player = Players.findOne(playerId);

    if (!roulette || !player) return;
    if (!roulette.result) return;

    generateHackerClue({ roulette, player });
  },
});
