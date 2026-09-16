import { roulettesFindCurrent } from '../../roulettes/methods/roulettes.findCurrent';
import RouletteBets from '../rouletteBets';
import { Player } from '/imports/schemas/player';
import { RouletteId } from '/imports/schemas/roulette';

export const getPendingRouletteBet = async ({
  player,
  rouletteId,
}: {
  player: Player;
  rouletteId?: RouletteId;
}) => {
  if (!rouletteId) {
    const roulette = await roulettesFindCurrent();
    if (!roulette) {
      return undefined;
    }
    rouletteId = roulette._id;
  }
  const pendingRouletteBet = await RouletteBets.findOneAsync({
    'player.id': player._id,
    roulette_id: rouletteId,
    status: 'pending',
  });
  return pendingRouletteBet;
};
