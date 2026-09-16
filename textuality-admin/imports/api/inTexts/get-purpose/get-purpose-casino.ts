import {
  InTextPurposeBase,
  InTextPurposeCasino,
} from '/imports/schemas/inText';
import { GetPurposeArgs } from './get-purpose';
import { betStepIsAcceptingFreeInput } from '../../themes/casino/rouletteBets/helpers';

export const getPurposeCasino = async ({
  message,
  player,
}: GetPurposeArgs): Promise<
  (InTextPurposeCasino | InTextPurposeBase) | undefined
> => {
  if (
    message.interactive &&
    message.interactive.value.startsWith('rouletteBet/')
  ) {
    return 'roulette-step';
  }

  if (message.text && message.text.startsWith('!')) {
    if (message.text.toLowerCase().startsWith('!bet')) {
      return 'roulette';
    }

    return 'slot';
  }

  // For free response, we want to be sure that this check runs last
  // so that it doesn't get miscategorized.
  if (await betStepIsAcceptingFreeInput({ message, player })) {
    return 'roulette-step';
  }

  return undefined;
};
