import RouletteBets, { RouletteBetWithHelpers } from '../rouletteBets';
import { rouletteBetAskWager } from './rouletteBet.askWager';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import {
  ROULETTE_NUMBER_MINIMUM,
  ROULETTE_NUMBER_MAXIMUM,
} from '/imports/schemas/roulette';

type ProcessBetNumberArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
  value: string;
};

export const rouletteBetProcessNumber = async ({
  player,
  rouletteBet,
  value,
}: ProcessBetNumberArgs) => {
  const numValue = parseInt(value.trim());

  if (isNaN(numValue)) {
    sendAutoText({
      playerId: player._id,
      trigger: 'ROULETTE_BET_ASK_NUMBER_INVALID',
    });
    return;
  }

  if (
    numValue < ROULETTE_NUMBER_MINIMUM ||
    numValue > ROULETTE_NUMBER_MAXIMUM
  ) {
    sendAutoText({
      playerId: player._id,
      trigger: 'ROULETTE_BET_ASK_NUMBER_OUTOFRANGE',
    });
    return;
  }

  await RouletteBets.updateAsync(rouletteBet._id, {
    $set: {
      bet_slot: numValue,
      step: 'wager',
    },
  });
  rouletteBet.bet_slot = numValue;
  rouletteBet.step = 'wager';

  rouletteBetAskWager({
    player,
    rouletteBet,
  });
};
