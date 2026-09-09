import { InTextPurposeBase, InTextPurposeCasino } from '/imports/schemas/inText';
import { GetPurposeArgs } from './get-purpose';

export const getPurposeCasino = ({
  message,
}: GetPurposeArgs): (InTextPurposeCasino | InTextPurposeBase) | undefined => {
  if (message.interactive && message.interactive.value.startsWith('roulette/')) {
    return 'roulette-step';
  }

  if (message.text && message.text.startsWith('!')) {
    if (message.text.toLowerCase().startsWith('!bet')) {
      return 'roulette';
    }

    return 'slot';
  }

  return undefined;
};
