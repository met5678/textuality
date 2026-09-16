import RouletteBets, { RouletteBetWithHelpers } from '../rouletteBets';
import { rouletteBetAskNumber } from './rouletteBet.askNumber';
import { rouletteBetAskSpecial } from './rouletteBet.askSpecial';
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

  if (value === 'special') {
    await RouletteBets.updateAsync(rouletteBet._id, {
      $set: {
        step: 'special',
      },
    });

    rouletteBet.step = 'special';

    rouletteBetAskSpecial({
      player,
      rouletteBet,
    });
  }
};
