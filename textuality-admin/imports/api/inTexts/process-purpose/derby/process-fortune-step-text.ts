import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import RaceBets from '/imports/api/themes/derby/raceBets';
import Tellers from '/imports/api/themes/derby/tellers';
import Races from '/imports/api/themes/derby/race';
import Horses from '/imports/api/themes/derby/horses';
import { raceBetProcessBetType } from '/imports/api/themes/derby/raceBets/methods/raceBet.processBetType';
import { raceBetProcessHorse } from '/imports/api/themes/derby/raceBets/methods/raceBet.processHorse';
import { tellerUpdateBet } from '/imports/api/themes/derby/tellers/teller-flow/teller-update-bet';
import { raceBetProcessWager } from '/imports/api/themes/derby/raceBets/methods/raceBet.processWager';
import { raceBetProcessCancel } from '/imports/api/themes/derby/raceBets/methods/raceBet.processCancel';
import { tellerCompleteBet } from '/imports/api/themes/derby/tellers/teller-flow/teller-complete-bet';
import { tellerCancelBet } from '/imports/api/themes/derby/tellers/teller-flow/teller-cancel-bet';
import Fortunes from '/imports/api/themes/derby/fortunes';
import { fortuneProcessType } from '/imports/api/themes/derby/fortunes/methods/fortune.processType';

export const processFortuneStepText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  if (!inText.interactive) {
    return;
  }
  let [, fortuneId, value] = inText.interactive.value.split('/') ?? [];

  const fortune = await Fortunes.findOneAsync(fortuneId);

  if (!fortune) {
    throw new Error('Fortune not found, this should not happen');
  }

  if (fortune.status.startsWith('cancelled')) {
    sendAutoText({
      trigger: 'FORTUNE_TELLER_ERROR_ALREADY_TIMEDOUT',
      playerId: player._id,
    });
    return;
  } else if (fortune.status === 'given') {
    sendAutoText({
      trigger: 'FORTUNE_TELLER_ERROR_ALREADY_GIVEN',
      playerId: player._id,
    });
    return;
  }

  fortuneProcessType({
    fortune,
    player,
    value,
  });
};
