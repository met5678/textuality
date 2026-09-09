import { getPurposeCasino } from './get-purpose-casino';
import { getPurposeDerby } from './get-purpose-derby';
import { EventTheme } from '/imports/schemas/event';
import { InTextPurpose } from '/imports/schemas/inText';
import { Player } from '/imports/schemas/player';
import { IncomingMessageData } from '/imports/services/whatsapp';

export interface GetPurposeArgs {
  player: Player;
  message: IncomingMessageData;
  theme: EventTheme;
}

const getPurposeByTheme: Record<
  EventTheme,
  (args: GetPurposeArgs) => InTextPurpose | undefined
> = {
  derby: getPurposeDerby,
  casino: getPurposeCasino,
  clue: () => undefined,
};

function getPurpose({ message, player, theme }: GetPurposeArgs): InTextPurpose {
  if (player.status === 'new' || player.status === 'tentative') {
    return 'initial';
  }

  if (player.status === 'banned') {
    return 'ignore';
  }

  if (message.text) {
    if (message.text.startsWith('/')) {
      return 'system';
    }

    if (message.text.startsWith('#')) {
      return 'hashtag';
    }
  }

  if (getPurposeByTheme[theme]) {
    const purpose = getPurposeByTheme[theme]({ message, player, theme });
    if (purpose) {
      return purpose;
    }
  }

  return 'unknown';
}

export default getPurpose;
