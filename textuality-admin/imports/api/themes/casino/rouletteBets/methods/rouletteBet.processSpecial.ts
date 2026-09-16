import RouletteBets, { RouletteBetWithHelpers } from '../rouletteBets';
import { rouletteBetAskWager } from './rouletteBet.askWager';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { isRouletteBetSlotSpecial } from '/imports/schemas/rouletteBet';

type ProcessBetSpecialArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
  value: string;
};

export const rouletteBetProcessSpecial = async ({
  player,
  rouletteBet,
  value,
}: ProcessBetSpecialArgs) => {
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
