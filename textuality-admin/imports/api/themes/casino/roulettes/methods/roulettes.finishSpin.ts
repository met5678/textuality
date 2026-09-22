import Roulettes from '../roulettes';
import { RouletteId } from '/imports/schemas/roulette';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';
import { rouletteDoPayouts } from './roulettes.doPayouts';

export const rouletteFinishSpin = async (rouletteId: RouletteId) => {
  await Roulettes.updateAsync(rouletteId, {
    $set: {
      status: 'end-spin',
    },
  });

  rouletteDoPayouts(rouletteId);
};

export const rouletteFinishSpinMethod = getWrappedServerMethod(
  'roulettes.finishSpin',
  rouletteFinishSpin,
);
