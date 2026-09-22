import Fortunes from '../fortunes';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { FortuneId } from '/imports/schemas/derby/fortune';
import { PlayerId } from '/imports/schemas/player';

export const fortuneCancelFortune = async (
  fortuneId: FortuneId,
  playerId: PlayerId,
) => {
  await Fortunes.updateAsync(fortuneId, {
    $set: {
      status: 'cancelled-timeout',
    },
  });
  sendAutoText({
    trigger: 'FORTUNE_TELLER_TIMEOUT',
    playerId,
  });
};
