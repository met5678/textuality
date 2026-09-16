import RouletteBets from '../../rouletteBets';
import Roulettes from '../roulettes';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { missionEnd } from '/imports/api/missions/methods/missions.end';
import { RouletteId } from '/imports/schemas/roulette';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const rouletteCloseBets = async (rouletteId: RouletteId) => {
  const roulette = await Roulettes.findOneAsync(rouletteId);
  if (!roulette) return;

  await Roulettes.updateAsync(rouletteId, {
    $set: {
      bets_open: false,
    },
  });

  if (roulette?.linked_mission && roulette?.linked_mission !== 'none') {
    missionEnd(roulette.linked_mission);
  }

  const pendingBets = await RouletteBets.find({
    roulette_id: rouletteId,
    status: 'pending',
  }).fetchAsync();

  const pendingPlayers = [...new Set(pendingBets.map((bet) => bet.player.id))];

  await RouletteBets.updateAsync(
    {
      roulette_id: rouletteId,
      status: 'pending',
    },
    {
      $set: {
        status: 'cancelled-roulette',
      },
    },
    { multi: true },
  );

  pendingPlayers.forEach((playerId) => {
    sendAutoText({
      playerId,
      trigger: 'ROULETTE_BET_CANCELLED_LATE',
    });
  });
};

export const rouletteCloseBetsMethod = getWrappedServerMethod(
  'roulettes.closeBets',
  rouletteCloseBets,
);
