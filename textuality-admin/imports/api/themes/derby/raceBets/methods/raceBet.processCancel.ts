import { RaceWithHelpers } from '../../race/races';
import RaceBets, { RaceBetWithHelpers } from '../raceBets';
import { raceBetAskHorse } from './raceBet.askHorse';
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
