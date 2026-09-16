import RaceBets, { RaceBetWithHelpers } from '../raceBets';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';

type ProcessCancelArgs = {
  player: PlayerWithHelpers;
  raceBet: RaceBetWithHelpers;
};

export const raceBetProcessCancel = async ({
  player,
  raceBet,
}: ProcessCancelArgs) => {
  await RaceBets.updateAsync(raceBet._id, {
    $set: {
      status: 'cancelled-user',
    },
  });

  sendAutoText({
    trigger: 'TELLER_CANCEL_USER',
    playerId: player._id,
  });
};
