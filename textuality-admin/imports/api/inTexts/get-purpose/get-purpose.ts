import { InText, InTextPurpose } from '/imports/schemas/inText';
import { Player } from '/imports/schemas/player';
import { IncomingMessageData } from '/imports/services/whatsapp';

interface GetPurposeArgs {
  player: Player;
  message: IncomingMessageData;
}

function getPurpose({ message, player }: GetPurposeArgs): InTextPurpose {
  if (player.status === 'new' || player.status === 'tentative') {
    return 'initial';
  }

  if (player.status === 'banned') {
    return 'ignore';
  }

  if (!message.text && message.media) {
    return 'mediaOnly';
  }

  if (message.text) {
    if (message.text.startsWith('/')) {
      return 'system';
    }

    if (message.text.startsWith('#')) {
      return 'hashtag';
    }

    if (message.text.startsWith('%')) {
      return 'percent';
    }

    if (message.text.startsWith('!')) {
      return 'bet';
    }

    return 'feed';
  }

  return 'ignore';
}

export default getPurpose;
