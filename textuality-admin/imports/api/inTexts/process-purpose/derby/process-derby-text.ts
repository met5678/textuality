import { processBetStepText } from './process-bet-step-text';
import { processTellerText } from './process-teller-text';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { InText } from '/imports/schemas/inText';

export const processDerbyText = (inText: InText, player: PlayerWithHelpers) => {
  if (inText.purpose === 'teller') {
    return processTellerText(inText, player);
  }

  if (inText.purpose === 'bet-step') {
    return processBetStepText(inText, player);
  }

  return;
};
