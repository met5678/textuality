import { Meteor } from 'meteor/meteor';
import Tellers from './tellers';
import Events from '/imports/api/events';
import {
  TELLER_CLOSED_STATUSES,
  TELLER_BUSY_STATUSES,
  TELLER_VIDEO_LENGTHS,
  TELLER_OPEN_STATUSES,
  TELLER_AVAILABLE_STATUSES,
} from '/imports/schemas/derby/teller-status/teller-status';
import { waitForSecondsCancellable } from '/imports/utils/async-wait-for';
import { TellerId } from '/imports/schemas/derby/teller';
import { maleDogNames } from '/imports/utils/male-dog-names';
import { RaceBetId } from '/imports/schemas/derby/raceBet';
import { PlayerId } from '/imports/schemas/player';

const TELLER_TIMEOUT_CANCELS: Partial<Record<TellerId, () => void>> = {};
const BET_STEP_TIMEOUT_SECONDS = 20;
const BET_STEP_BUSY_THRESHOLD_SECONDS = 10;

const getRandomTextCode = () => {
  return maleDogNames[Math.floor(Math.random() * maleDogNames.length)];
};

const cancelAndDeleteTimeout = (teller_id: TellerId) => {
  TELLER_TIMEOUT_CANCELS[teller_id]?.();
  delete TELLER_TIMEOUT_CANCELS[teller_id];
};

const TimeoutError = new Meteor.Error(
  'teller-timeout-cancelled',
  'Teller timeout cancelled',
);

/**
 * This function cancels any existing timeout, creates a new one, and throws an error
 * if the new timeout is cancelled.
 * @param teller_id
 * @param seconds
 */
const throwIfCancelledTimeout = async (
  teller_id: TellerId,
  seconds: number,
) => {
  cancelAndDeleteTimeout(teller_id);
  const [promise, cancel] = waitForSecondsCancellable(seconds);
  TELLER_TIMEOUT_CANCELS[teller_id] = cancel;
  await promise;
  if (TELLER_TIMEOUT_CANCELS[teller_id] !== cancel) {
    throw TimeoutError;
  }
  delete TELLER_TIMEOUT_CANCELS[teller_id];
};

Meteor.methods({
  'derby.tellers.getForCode': async (code: string) => {
    const teller = await Tellers.findOneAsync({
      event: Events.currentIdOrThrow(),
      text_code: code,
    });
    return teller;
  },

  'derby.tellers.open': async (teller_id: string) => {
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
  },

  'derby.tellers.startBet': async (
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
      try {
        await throwIfCancelledTimeout(teller_id, 1);
      } catch (error) {
        if (error === TimeoutError) return;
        throw error;
      }

      Tellers.updateAsync(teller_id, {
        $set: {
          status:
            time_left > BET_STEP_BUSY_THRESHOLD_SECONDS
              ? 'betting'
              : 'betting-impatient',
          time_left: time_left,
        },
      });
      time_left -= BET_STEP_BUSY_THRESHOLD_SECONDS;
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
  },

  'derby.tellers.close': async (teller_id: TellerId) => {
    const teller = await Tellers.findOneAsync(teller_id);

    if (!teller) {
      throw new Meteor.Error('teller-not-found', 'Teller not found');
    }

    if (!TELLER_OPEN_STATUSES.includes(teller.status)) {
      throw new Meteor.Error('teller-not-open', 'Teller is not open');
    }

    if (teller.current_bet) {
      Meteor.callAsync('derby.raceBets.cancelBet', {
        bet_id: teller.current_bet,
        reason: 'close',
      });
    }

    Tellers.updateAsync(teller_id, {
      $set: {
        status: 'closing',
      },
      $unset: {
        current_bet: 1,
        current_player: 1,
        text_code: 1,
        time_left: 1,
      },
    });

    try {
      await throwIfCancelledTimeout(
        teller_id,
        TELLER_VIDEO_LENGTHS?.closing ?? 5,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    Tellers.updateAsync(teller_id, {
      $set: {
        status: 'break',
      },
    });
  },

  'derby.tellers.standup': async (teller_id: string) => {
    const teller = await Tellers.findOneAsync(teller_id);
    if (!teller) {
      throw new Meteor.Error('teller-not-found', 'Teller not found');
    }

    if (teller.status !== 'break') {
      throw new Meteor.Error('teller-not-break', 'Teller is not on break');
    }

    Tellers.updateAsync(teller_id, {
      $set: { status: 'standup' },
    });

    try {
      await throwIfCancelledTimeout(
        teller_id,
        TELLER_VIDEO_LENGTHS?.standup ?? 5,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    Tellers.updateAsync(teller_id, {
      $set: { status: 'empty' },
    });
  },

  'derby.tellers.sitdown': async (teller_id: string) => {
    const teller = await Tellers.findOneAsync(teller_id);
    if (!teller) {
      throw new Meteor.Error('teller-not-found', 'Teller not found');
    }

    if (teller.status !== 'empty') {
      throw new Meteor.Error('teller-not-empty', 'Teller is not empty');
    }

    Tellers.updateAsync(teller_id, {
      $set: { status: 'sitdown' },
    });

    try {
      await throwIfCancelledTimeout(
        teller_id,
        TELLER_VIDEO_LENGTHS?.sitdown ?? 10,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    Tellers.updateAsync(teller_id, {
      $set: { status: 'break' },
    });
  },

  'derby.tellers.getAvailableTextCode': async () => {
    const tellerCodes = await Tellers.find(
      { event: Events.currentIdOrThrow() },
      { fields: { text_code: 1 } },
    ).mapAsync((teller) => teller.text_code);

    let newCode = '';
    do {
      newCode = getRandomTextCode();
    } while (tellerCodes.includes(newCode));

    return newCode;
  },

  'derby.tellers.tryStartBet': async ({
    teller_id,
    player_id,
  }: {
    teller_id: string;
    player_id: string;
  }) => {
    const teller = await Tellers.findOneAsync(teller_id);
    if (!teller) {
      return;
    }
    if (TELLER_BUSY_STATUSES.includes(teller.status)) {
      Meteor.callAsync('autoTexts.send', {
        trigger: 'TELLER_BUSY',
        playerId: player_id,
        templateVars: {},
      });
      return;
    }

    if (TELLER_CLOSED_STATUSES.includes(teller.status)) {
      Meteor.callAsync('autoTexts.send', {
        trigger: 'TELLER_CLOSED_RACE_ACTIVE',
        playerId: player_id,
        templateVars: {},
      });
    }

    if (!teller) {
      throw new Meteor.Error('teller-not-found', 'Teller not found');
    }
  },
});
