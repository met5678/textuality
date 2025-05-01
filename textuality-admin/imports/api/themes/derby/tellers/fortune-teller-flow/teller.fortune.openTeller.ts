import { Meteor } from 'meteor/meteor';
import {
  TELLER_CLOSED_STATUSES,
  TELLER_VIDEO_LENGTHS,
} from '/imports/schemas/derby/teller-status/teller-status';
import Tellers from '../tellers';
import { fortuneTellerGetCode } from './teller.fortune.getCode';
import { throwIfCancelledTimeout } from '../teller-flow/_teller-timeouts';
import { TimeoutError } from '../teller-flow/_teller-timeouts';

export const fortuneTellerOpen = async (teller_id: string) => {
  console.log('derby.tellers.fortune-open', teller_id);
  const teller = await Tellers.findOneAsync(teller_id);
  if (!teller) {
    throw new Meteor.Error('teller-not-found', 'Teller not found');
  }

  if (!TELLER_CLOSED_STATUSES.includes(teller.status)) {
    throw new Meteor.Error('teller-not-closed', 'Teller is not closed');
  }

  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'fortune-opening',
    },
  });

  try {
    await throwIfCancelledTimeout(
      teller_id,
      TELLER_VIDEO_LENGTHS?.['fortune-opening'] ?? 5,
    );
  } catch (error) {
    if (error === TimeoutError) return;
    throw error;
  }

  const newTextCode = await fortuneTellerGetCode();

  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'fortune-open',
      text_code: newTextCode,
    },
  });
};
