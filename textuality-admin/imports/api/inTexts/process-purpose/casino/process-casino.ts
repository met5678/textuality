import processBetText from './process-bet-text';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { InText } from '/imports/schemas/inText';

export const processCasinoText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  if (inText.purpose === 'bet') {
    return processBetText(inText, player);
  }

  return;
};
