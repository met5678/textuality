import { GetPurposeArgs } from './get-purpose';
import { InTextPurposeBase, InTextPurposeDerby } from '/imports/schemas/inText';

export const getPurposeDerby = ({
  message,
}: GetPurposeArgs): (InTextPurposeDerby | InTextPurposeBase) | undefined => {
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
