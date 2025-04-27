import { Meteor } from 'meteor/meteor';
import Tellers from '../tellers';
import { throwIfCancelledTimeout, TimeoutError } from './_teller-timeouts';
import { RaceBetId } from '/imports/schemas/derby/raceBet';
import { TellerId } from '/imports/schemas/derby/teller';
import {
  TELLER_AVAILABLE_STATUSES,
  TELLER_VIDEO_LENGTHS,
} from '/imports/schemas/derby/teller-status/teller-status';
import { PlayerId } from '/imports/schemas/player';

const BET_STEP_TIMEOUT_SECONDS = 20;
const BET_STEP_BUSY_THRESHOLD_SECONDS = 10;

export const startBet = async (
  teller_id: TellerId,
  bet_id: RaceBetId,
  player_id: PlayerId,
) => {
  const teller = await Tellers.findOneAsync(teller_id);
  if (!teller) {
    throw new Meteor.Error('teller-not-found', 'Teller not found');
  }

  if (!TELLER_AVAILABLE_STATUSES.includes(teller.status)) {
    throw new Meteor.Error('teller-not-available', 'Teller is not available');
  }

  let time_left = BET_STEP_TIMEOUT_SECONDS;
  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'betting',
      current_bet: bet_id,
      current_player: player_id,
      time_left: time_left,
    },
    $unset: {
      text_code: 1,
    },
  });

  // Countdown to the timeout
  do {
    console.log('time_left', time_left);
    Tellers.updateAsync(teller_id, {
      $set: {
        status:
          time_left > BET_STEP_BUSY_THRESHOLD_SECONDS
            ? 'betting'
            : 'betting-impatient',
        time_left: time_left,
      },
    });

    try {
      await throwIfCancelledTimeout(teller_id, 1);
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    time_left -= 1;
  } while (time_left > 0);

  Meteor.callAsync('raceBets.cancelBet', {
    bet_id: teller.current_bet,
    reason: 'timeout',
  });

  Tellers.updateAsync(teller_id, {
    $set: {
      status: 'timeout',
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
