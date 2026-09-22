import { processRouletteBetStepText } from './process-roulette-step-text';
import { processRouletteText } from './process-roulette-text';
import { processSlotText } from './process-slot-text';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { InText, isInTextPurposeCasino } from '/imports/schemas/inText';

export const processCasinoText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  if (!isInTextPurposeCasino(inText.purpose)) {
    throw new Error(
      `processCasinoText: inText.purpose "${inText.purpose}" is not valid for casino theme`,
    );
  }

  if (inText.purpose === 'slot') {
    // return processBetText(inText, player);
    return processSlotText(inText, player);
  } else if (inText.purpose === 'roulette') {
    // return processBetText(inText, player);
    return processRouletteText(player);
  } else if (inText.purpose === 'roulette-step') {
    return processRouletteBetStepText(inText, player);
  }

  return;
};
