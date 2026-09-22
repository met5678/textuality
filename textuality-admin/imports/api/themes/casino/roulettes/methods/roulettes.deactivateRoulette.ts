import Roulettes from '../roulettes';
import { RouletteId } from '/imports/schemas/roulette';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const rouletteDeactivate = async (rouletteId: RouletteId) => {
  Roulettes.updateAsync(rouletteId, {
    $set: {
      bets_open: false,
      status: 'inactive',
    },
  });
};

export const rouletteDeactivateMethod = getWrappedServerMethod(
  'roulettes.deactivateRoulette',
  rouletteDeactivate,
);
