import RouletteBets, { RouletteBetWithHelpers } from '../rouletteBets';
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

  sendAutoText({
    trigger: 'ROULETTE_BET_CANCELLED_USER',
    playerId: player._id,
  });
};
