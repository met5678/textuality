import { Meteor } from 'meteor/meteor';
import Tellers from '../tellers';
import {
  throwIfCancelledTimeout,
  TimeoutError,
} from '../teller-flow/_teller-timeouts';
import { TellerId } from '/imports/schemas/derby/teller';
import {
  TELLER_FORTUNE_STATUSES,
  TELLER_VIDEO_LENGTHS,
} from '/imports/schemas/derby/teller-status/teller-status';

export const fortuneTellerClose = async (teller_id: TellerId) => {
  const teller = await Tellers.findOneAsync(teller_id);

  if (!teller) {
    throw new Meteor.Error('teller-not-found', 'Teller not found');
  }

  if (!TELLER_FORTUNE_STATUSES.includes(teller.status)) {
    throw new Meteor.Error(
      'teller-not-fortune-teller',
      'Teller is not a fortune teller',
    );
  }

  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'fortune-closing',
    },
    $unset: {
      current_player: 1,
      text_code: 1,
      time_left: 1,
    },
  });

  try {
    await throwIfCancelledTimeout(
      teller_id,
      TELLER_VIDEO_LENGTHS?.['fortune-closing'] ?? 5,
    );
  } catch (error) {
    if (error === TimeoutError) return;
    throw error;
  }

  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'empty',
    },
  });
};
