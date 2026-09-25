import RouletteBets, { RouletteBetWithHelpers } from '../rouletteBets';
import { rouletteBetAskNumber } from './rouletteBet.askNumber';
import { rouletteBetAskWager } from './rouletteBet.askWager';
import { isRouletteBetSlotSpecial } from '/imports/schemas/rouletteBet';
import { PlayerWithHelpers } from '/imports/api/players/players';

type ProcessBetTypeArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
  value: string;
};

export const rouletteBetProcessType = async ({
  player,
  rouletteBet,
  value,
}: ProcessBetTypeArgs) => {
  if (value === 'number') {
    await RouletteBets.updateAsync(rouletteBet._id, {
      $set: {
        step: 'number',
      },
    });
    rouletteBet.step = 'number';

    console.log('Updated roulette bet to number');

    rouletteBetAskNumber({
      player,
      rouletteBet,
    });
  }

  if (!isRouletteBetSlotSpecial(value)) {
    throw new Error('Invalid rouletteBet special type');
  }

  await RouletteBets.updateAsync(rouletteBet._id, {
    $set: {
      bet_slot: value,
      step: 'wager',
    },
  });
  rouletteBet.bet_slot = value;
  rouletteBet.step = 'wager';

  rouletteBetAskWager({
    player,
    rouletteBet,
  });
};
