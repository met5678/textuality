import { DateTime } from 'luxon';
import { Meteor } from 'meteor/meteor';
import Roulettes from '../roulettes';
import { RouletteId } from '/imports/schemas/roulette';
import { missionStart } from '/imports/api/missions/methods/missions.start';

export const rouletteOpenBets = async (rouletteId: RouletteId) => {
  const roulette = await Roulettes.findOneAsync(rouletteId);
  if (!roulette) return;

  Meteor.call('rouletteBets.clearBets', rouletteId);

  const result = Math.floor(Math.random() * 37);

  if (!roulette.scheduled) {
    await Roulettes.updateAsync(rouletteId, {
      $set: {
        result,
        bets_open: true,
        status: 'pre-spin',
        bets_start_at: new Date(),
        spin_starts_at: DateTime.local().plus({ minutes: 5 }).toJSDate(),
      },
    });
  } else {
    await Roulettes.updateAsync(rouletteId, {
      $set: {
        result,
        bets_open: true,
        status: 'pre-spin',
      },
    });
  }

  if (roulette?.linked_mission && roulette?.linked_mission !== 'none') {
    missionStart(roulette.linked_mission);
  }
};
