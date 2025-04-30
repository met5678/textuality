import { Meteor } from 'meteor/meteor';
import Tellers from '../tellers';
import { throwIfCancelledTimeout, TimeoutError } from './_teller-timeouts';
import { TellerId } from '/imports/schemas/derby/teller';
import { TELLER_VIDEO_LENGTHS } from '/imports/schemas/derby/teller-status/teller-status';

export const tellerCancelBet = async (teller_id: TellerId) => {
  const teller = await Tellers.findOneAsync(teller_id);
  if (!teller) {
    console.warn(
      `Can't cancel bet for teller ${teller_id} because it doesn't exist`,
    );
    return;
  }

  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'timeout',
    },
    $unset: {
      time_left: 1,
    },
  });

  try {
    await throwIfCancelledTimeout(
      teller_id,
      TELLER_VIDEO_LENGTHS?.timeout ?? 5,
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
    $unset: {
      current_bet: 1,
      current_player: 1,
      time_left: 1,
    },
  });
};
