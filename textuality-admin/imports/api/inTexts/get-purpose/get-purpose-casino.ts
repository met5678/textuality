import { InTextPurpose } from '/imports/schemas/inText';
import { GetPurposeArgs } from './get-purpose';

export const getPurposeCasino = ({
  message,
  player,
}: GetPurposeArgs): InTextPurpose | undefined => {
  if (message.text && message.text.startsWith('!')) {
    return 'bet';
  }

  return undefined;
};
