import Roulettes from '../roulettes';
import { RouletteId } from '/imports/schemas/roulette';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const rouletteRevealWinners = async (rouletteId: RouletteId) => {
  await Roulettes.updateAsync(rouletteId, {
    $set: {
      status: 'winners-board',
    },
  });
};

export const rouletteRevealWinnersMethod = getWrappedServerMethod(
  'roulettes.revealWinners',
  rouletteRevealWinners,
);
