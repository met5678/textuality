import { processSlotText } from './process-slot-text';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { InText } from '/imports/schemas/inText';

export const processCasinoText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  if (inText.purpose === 'slot') {
    // return processBetText(inText, player);
    return processSlotText(inText, player);
  }

  return;
};
