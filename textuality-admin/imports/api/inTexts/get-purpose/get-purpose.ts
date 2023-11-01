import { InText } from '/imports/schemas/inText';
import { Player } from '/imports/schemas/player';

interface GetPurposeArgs {
  player: Player;
  message: InText;
}

function getPurpose({ message, player }: GetPurposeArgs): string {
  if (player.status === 'new' || player.status === 'tentative') {
    return 'initial';
  }

  if (player.status === 'banned') {
    return 'ignore';
  }

  if (!message.body && message.media) {
    return 'mediaOnly';
  }

  if (message.body) {
    if (message.body.startsWith('/')) {
      return 'system';
    }

    if (message.body.startsWith('#')) {
      return 'hashtag';
    }

    return 'feed';
  }

  return 'ignore';
}

export default getPurpose;
