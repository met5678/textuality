import { Meteor } from 'meteor/meteor';
import { RaceWithHelpers } from '../../race/races';
import RaceBets, { RaceBetWithHelpers } from '../raceBets';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { RaceBetComplete } from '/imports/schemas/derby/raceBet';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { DateTime } from 'luxon';
import { TellerWithHelpers } from '../../tellers/tellers';
import Horses from '../../horses/horses';
import { tellerCompleteBet } from '../../tellers/teller-flow/teller-complete-bet';

type ProcessBetTypeArgs = {
  player: PlayerWithHelpers;
  raceBet: RaceBetWithHelpers;
  race: RaceWithHelpers;
  teller: TellerWithHelpers;
};

const validateRaceBet = (
  raceBet: RaceBetWithHelpers,
): raceBet is RaceBetComplete => {
  return (
    typeof raceBet.base_bet === 'number' &&
    typeof raceBet.count === 'number' &&
    Array.isArray(raceBet.horses) &&
    raceBet.horses.length > 0 &&
    (raceBet.type === 'win'
      ? raceBet.horses.length === 1
      : raceBet.horses.length === 3)
  );
};

const getBetHorses = async (raceBet: RaceBetComplete) => {
  const horses = await Horses.find(
    {
      _id: { $in: raceBet.horses },
    },
    { fields: { name: 1, number: 1 } },
  ).fetchAsync();

  return raceBet.horses.map((horseId) => {
    const horse = horses.find((h) => h._id === horseId);
    if (!horse) {
      throw new Error('Horse not found');
    }
    return {
      name: horse.name,
      number: horse.number,
    };
  });
};

export const raceBetPlaceBet = async ({
  player,
  raceBet,
  race,
  teller,
}: ProcessBetTypeArgs) => {
  await RaceBets.updateAsync(raceBet._id, {
    $set: {
      status: 'placed',
      placed_at: new Date(),
      step: 'done',
    },
  });

  raceBet.status = 'placed';
  raceBet.placed_at = new Date();
  raceBet.step = 'done';

  if (!validateRaceBet(raceBet)) {
    throw new Error('Invalid race bet');
  }

  const betHorses = await getBetHorses(raceBet);
  const costToPlayer = Math.min(player.money, raceBet.base_bet * raceBet.count);

  Meteor.call('players.takeMoney', {
    playerId: player._id,
    money: costToPlayer,
  });

  if (raceBet.type === 'win') {
    sendAutoText({
      trigger: 'TELLER_BET_PLACED_WIN',
      playerId: player._id,
      templateVars: {
        teller_name: teller.text_code,
        race_number: race.number,
        race_starts_at: DateTime.fromJSDate(
          race.time_race_starts_at,
        ).toLocaleString(DateTime.TIME_SIMPLE),
        bet_count: raceBet.count,
        bet_base: raceBet.base_bet,
        bet_value: raceBet.base_bet * raceBet.count,
        horse_name: betHorses[0].name,
        horse_number: betHorses[0].number,
      },
    });
    Meteor.callAsync('achievements.tryUnlock', {
      trigger: 'TELLER_BET_PLACED_WIN',
      playerId: player._id,
    });
  } else {
    sendAutoText({
      trigger: 'TELLER_BET_PLACED_TRIFECTA',
      playerId: player._id,
      templateVars: {
        teller_name: teller.text_code,
        race_number: race.number,
        race_starts_at: DateTime.fromJSDate(
          race.time_race_starts_at,
        ).toLocaleString(DateTime.TIME_SIMPLE),
        bet_count: raceBet.count,
        bet_base: raceBet.base_bet,
        bet_value: raceBet.base_bet * raceBet.count,
        horse1_name: betHorses[0].name,
        horse1_number: betHorses[0].number,
        horse2_name: betHorses[1].name,
        horse2_number: betHorses[1].number,
        horse3_name: betHorses[2].name,
        horse3_number: betHorses[2].number,
      },
    });
    Meteor.callAsync('achievements.tryUnlock', {
      trigger: 'TELLER_BET_PLACED_TRIFECTA',
      playerId: player._id,
    });
  }

  tellerCompleteBet(teller._id, raceBet._id);

  // TODO: Update Odds
};
