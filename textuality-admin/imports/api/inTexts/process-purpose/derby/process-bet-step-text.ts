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

export const processBetStepText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  if (!inText.interactive) {
    return;
  }
  let [, raceBetId, step, value] = inText.interactive.value.split('/') ?? [];

  const raceBet = await RaceBets.findOneAsync(raceBetId);

  if (!raceBet) {
    throw new Error('Race bet not found, this should not happen');
  }

  if (raceBet.status !== 'pending') {
    sendAutoText({
      trigger: 'TELLER_ERROR_ALREADY_PLACED_BET',
      playerId: player._id,
      templateVars: {
        teller_name: raceBet.teller,
      },
    });
    return;
  }

  if (step === 'ticket') {
    step = 'wager';
  }

  if (step === 'cancel') {
    raceBetProcessCancel({
      player,
      raceBet,
    });
    tellerCancelBet(raceBet.teller);
    return;
  }

  if (step !== raceBet.step) {
    sendAutoText({
      trigger: 'TELLER_ERROR_ALREADY_ANSWERED_STEP',
      playerId: player._id,
      templateVars: {
        step: raceBet.step,
        expected_step: step,
      },
    });
    return;
  }

  const teller = await Tellers.findOneAsync(raceBet.teller);
  const race = await Races.findOneAsync(raceBet.race, {
    fields: {
      horses: 1,
      odds: 1,
    },
    sort: {
      number: 1,
    },
  });

  if (!teller || !race) {
    throw new Error('Teller or race not found, this should not happen');
  }

  if (step === 'bet-type') {
    raceBetProcessBetType({
      player,
      raceBet,
      race,
      value,
    });
    tellerUpdateBet(teller._id, raceBet._id);
    return;
  }

  if (step.startsWith('horse')) {
    raceBetProcessHorse({
      player,
      raceBet,
      race,
      horseNum: parseInt(step.replace('horse', '')),
      value,
      teller,
    });
    tellerUpdateBet(teller._id, raceBet._id);
    return;
  }

  if (step === 'wager') {
    raceBetProcessWager({
      player,
      raceBet,
      teller,
      race,
      value,
    });
    return;
  }
};
