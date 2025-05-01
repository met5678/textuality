import { InText, InTextPurpose } from '/imports/schemas/inText';
import { Player } from '/imports/schemas/player';
import { IncomingMessageData } from '/imports/services/whatsapp';

interface GetPurposeArgs {
  player: Player;
  message: IncomingMessageData;
}

export const getPurposeDerby = ({
  message,
  player,
}: GetPurposeArgs): InTextPurpose | undefined => {
  if (message.interactive && message.interactive.value.startsWith('raceBet/')) {
    return 'bet-step';
  }

  if (message.interactive && message.interactive.value.startsWith('fortune/')) {
    return 'fortune-step';
  }

  if (message.text) {
    if (message.text.startsWith('@')) {
      return 'teller';
    }
  }

  return undefined;
};
