import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import RouletteBets from '/imports/api/themes/casino/rouletteBets';
import { getPendingRouletteBet } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.getPendingBet';
import { rouletteBetProcessCancel } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.processCancel';
import { rouletteBetProcessType } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.processType';
import { rouletteBetProcessNumber } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.processNumber';
import { rouletteBetProcessWager } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.processWager';
import Roulettes from '/imports/api/themes/casino/roulettes';
import { rouletteBetProcessSpecial } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.processSpecial';

const getNormalizedTextData = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  if (inText.interactive) {
    let [, rouletteBetId, step, value] =
      inText.interactive.value.split('/') ?? [];

    const rouletteBet = await RouletteBets.findOneAsync(rouletteBetId);
    return {
      rouletteBet,
      step,
      value,
    };
  } else {
    const rouletteBet = await getPendingRouletteBet({ player });
    return {
      rouletteBet,
      step: rouletteBet?.step,
      value: inText.body,
    };
    // Find the currently pending bet
  }
};

export const processRouletteBetStepText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  const { rouletteBet, step, value } = await getNormalizedTextData(
    inText,
    player,
  );

  console.log(`Processing roulette bet step`, {
    step,
    rouletteBet,
    inText: inText.interactive,
  });

  if (!rouletteBet) {
    throw new Error('Roulette bet not found, this should not happen');
  }

  if (rouletteBet.status.startsWith('cancelled')) {
    sendAutoText({
      trigger: 'ROULETTE_BET_ALREADY_CANCELLED',
      playerId: player._id,
    });
    return;
  } else if (rouletteBet.status !== 'pending') {
    sendAutoText({
      trigger: 'ROULETTE_BET_ALREADY_PLACED',
      playerId: player._id,
    });
    return;
  }

  if (step === 'cancel') {
    rouletteBetProcessCancel({
      player,
      rouletteBet,
    });
    return;
  }

  if (step !== rouletteBet.step) {
    sendAutoText({
      trigger: 'ROULETTE_BET_ALREADY_ANSWERED_STEP',
      playerId: player._id,
      templateVars: {
        step: rouletteBet.step,
        expected_step: step,
      },
    });
    return;
  }

  const roulette = await Roulettes.findOneAsync(rouletteBet.roulette_id);
  if (!roulette) {
    throw new Error('Roulette not found, this should not happen');
  }

  if (step === 'type') {
    rouletteBetProcessType({
      player,
      rouletteBet,
      value,
    });
    return;
  }

  if (step === 'number') {
    rouletteBetProcessNumber({
      player,
      rouletteBet,
      value,
    });
    return;
  }

  if (step === 'special') {
    rouletteBetProcessSpecial({
      player,
      rouletteBet,
      value,
    });
    return;
  }

  if (step === 'wager') {
    rouletteBetProcessWager({
      player,
      rouletteBet,
      roulette,
      value,
    });
    return;
  }

  throw new Error(`Unknown step: ${step}`);
};
