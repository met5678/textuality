import { Meteor } from 'meteor/meteor';
import { RaceWithHelpers } from '../../race/races';
import RaceBets, { RaceBetWithHelpers } from '../raceBets';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { RaceBetComplete } from '/imports/schemas/derby/raceBet';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { DateTime } from 'luxon';
import { TellerWithHelpers } from '../../tellers/tellers';

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
    typeof raceBet.placed_at === 'number' &&
    typeof raceBet.base_bet === 'number' &&
    typeof raceBet.count === 'number' &&
    Array.isArray(raceBet.horses) &&
    raceBet.horses.length > 0 &&
    (raceBet.type === 'win'
      ? raceBet.horses.length === 1
      : raceBet.horses.length === 3)
  );
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
        race_number: race.number,
        race_starts_at: DateTime.fromJSDate(
          race.time_race_starts_at,
        ).toLocaleString(DateTime.TIME_SIMPLE),
        bet_value: raceBet.base_bet * raceBet.count,
        horse_name: raceBet.horses[0],
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
        bet_value: raceBet.base_bet * raceBet.count,
        horse1_name: raceBet.horses[0],
        horse2_name: raceBet.horses[1],
        horse3_name: raceBet.horses[2],
      },
    });
    Meteor.callAsync('achievements.tryUnlock', {
      trigger: 'TELLER_BET_PLACED_TRIFECTA',
      playerId: player._id,
    });
  }

  // TODO: Update Odds
};
