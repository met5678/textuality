import { RaceWithHelpers } from '../../race/races';
import { TellerWithHelpers } from '../../tellers/tellers';
import RaceBets, { RaceBetWithHelpers } from '../raceBets';
import { raceBetPlaceBet } from './raceBet.placeBet';
import { PlayerWithHelpers } from '/imports/api/players/players';

type ProcessWagerArgs = {
  player: PlayerWithHelpers;
  raceBet: RaceBetWithHelpers;
  race: RaceWithHelpers;
  teller: TellerWithHelpers;
  value: string;
};

export const raceBetProcessWager = async ({
  player,
  raceBet,
  race,
  value,
  teller,
}: ProcessWagerArgs) => {
  const [multiple, baseBet] = value.split('x');

  const baseBetNumber = parseInt(baseBet);
  let multipleNumber = 0;
  if (multiple === 'let-it-ride') {
    multipleNumber = Math.ceil(player.money / baseBetNumber);
  } else {
    multipleNumber = parseInt(multiple);
  }

  await RaceBets.updateAsync(raceBet._id, {
    $set: {
      base_bet: baseBetNumber,
      count: multipleNumber,
    },
  });
  raceBet.base_bet = baseBetNumber;
  raceBet.count = multipleNumber;

  raceBetPlaceBet({
    player,
    raceBet,
    race,
    teller,
  });
};
