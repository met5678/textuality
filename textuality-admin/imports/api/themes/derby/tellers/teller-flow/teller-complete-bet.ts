import Tellers from '../tellers';
import { TellerId } from '/imports/schemas/derby/teller';
import { RaceBetId } from '/imports/schemas/derby/raceBet';
import RaceBets from '../../raceBets';
import { throwIfCancelledTimeout, TimeoutError } from './_teller-timeouts';
import { TELLER_VIDEO_LENGTHS } from '/imports/schemas/derby/teller-status/teller-status';
import { Meteor } from 'meteor/meteor';

export const tellerCompleteBet = async (
  teller_id: TellerId,
  bet_id: RaceBetId,
) => {
  const teller = await Tellers.findOneAsync(teller_id);
  const bet = await RaceBets.findOneAsync(bet_id);
  if (!teller) {
    console.warn(
      `Can't complete bet for teller ${teller_id} because it doesn't exist`,
    );
    return;
  }
  if (!bet) {
    console.warn(
      `Can't complete bet for teller ${teller_id} because the bet doesn't exist`,
    );
    return;
  }

  const statusVideo =
    bet.count === 1 ? 'giving-stub-single' : 'giving-stub-multi';

  Tellers.updateAsync(teller_id, {
    $set: {
      status: statusVideo,
    },
    $unset: {
      time_left: 1,
    },
  });

  try {
    await throwIfCancelledTimeout(
      teller_id,
      TELLER_VIDEO_LENGTHS?.[statusVideo] ?? 4,
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
