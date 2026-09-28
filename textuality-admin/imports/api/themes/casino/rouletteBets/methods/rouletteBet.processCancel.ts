import Roulettes from '../../roulettes';
import RouletteBets, { RouletteBetWithHelpers } from '../rouletteBets';
import { getRouletteBetSummary } from './rouletteBet.getBetSummary';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';

type ProcessCancelArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
};

export const rouletteBetProcessCancel = async ({
  player,
  rouletteBet,
}: ProcessCancelArgs) => {
  await RouletteBets.updateAsync(rouletteBet._id, {
    $set: {
      status: 'cancelled-user',
    },
  });

  const roulette = await Roulettes.findOneAsync(rouletteBet.roulette_id);
  if (!roulette) {
    throw new Error('No roulette found');
  } else {
    const betSummary = getRouletteBetSummary({ player, roulette });

    sendAutoText({
      trigger: 'ROULETTE_BET_CANCELLED_USER',
      playerId: player._id,
      templateVars: {
        bet_summary: betSummary,
      },
    });
  }
};
