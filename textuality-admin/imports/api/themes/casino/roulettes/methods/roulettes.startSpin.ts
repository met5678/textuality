import Roulettes from '../roulettes';
import { RouletteId } from '/imports/schemas/roulette';
import { rouletteOpenBets } from './roulettes.openBets';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const rouletteStartSpin = async (rouletteId: RouletteId) => {
  const roulette = await Roulettes.findOneAsync(rouletteId);
  if (!roulette) return;

  if (!roulette.bets_open) {
    await rouletteOpenBets(rouletteId);
  }

  await Roulettes.updateAsync(rouletteId, {
    $set: {
      status: 'spinning',
    },
  });
};

export const rouletteStartSpinMethod = getWrappedServerMethod(
  'roulettes.startSpin',
  rouletteStartSpin,
);
