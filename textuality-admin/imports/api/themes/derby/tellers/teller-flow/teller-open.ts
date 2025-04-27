import { Meteor } from 'meteor/meteor';
import {
  TELLER_CLOSED_STATUSES,
  TELLER_VIDEO_LENGTHS,
} from '/imports/schemas/derby/teller-status/teller-status';
import Tellers from '../tellers';
import { TimeoutError } from './_teller-timeouts';
import { throwIfCancelledTimeout } from './_teller-timeouts';

export const openTeller = async (teller_id: string) => {
  console.log('derby.tellers.open', teller_id);
  const teller = await Tellers.findOneAsync(teller_id);
  if (!teller) {
    throw new Meteor.Error('teller-not-found', 'Teller not found');
  }

  if (!TELLER_CLOSED_STATUSES.includes(teller.status)) {
    throw new Meteor.Error('teller-not-closed', 'Teller is not closed');
  }

  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'opening',
    },
  });

  try {
    await throwIfCancelledTimeout(
      teller_id,
      TELLER_VIDEO_LENGTHS?.opening ?? 5,
    );
  } catch (error) {
    if (error === TimeoutError) return;
    throw error;
  }

  const newTextCode = await Meteor.callAsync(
    'derby.tellers.getAvailableTextCode',
  );

  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'open',
      text_code: newTextCode,
    },
  });
};
