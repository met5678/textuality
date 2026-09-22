import { Meteor } from 'meteor/meteor';
import { waitForSecondsCancellable } from '/imports/utils/async-wait-for';
import { RaceId } from '/imports/schemas/derby/race';

const RACE_TIMEOUT_CANCELS: Partial<Record<RaceId, () => void>> = {};

const cancelAndDeleteTimeout = (race_id: RaceId) => {
  if (RACE_TIMEOUT_CANCELS[race_id]) {
    console.log('cancelling timeout', race_id);
    RACE_TIMEOUT_CANCELS[race_id]();
  }
  delete RACE_TIMEOUT_CANCELS[race_id];
};

export const TimeoutError = new Meteor.Error(
  'race-timeout-cancelled',
  'Race timeout cancelled',
);

/**
 * This function cancels any existing timeout, creates a new one, and throws an error
 * if the new timeout is cancelled.
 * @param teller_id - The id of the teller to throw the timeout for
 * @param seconds - How long the timeout should be
 */
export const throwIfCancelledTimeout = async (
  race_id: RaceId,
  seconds: number,
) => {
  cancelAndDeleteTimeout(race_id);
  const [promise, cancel] = waitForSecondsCancellable(seconds);
  RACE_TIMEOUT_CANCELS[race_id] = cancel;
  await promise;
  if (RACE_TIMEOUT_CANCELS[race_id] !== cancel) {
    console.log('last timeout cancelled');
    throw TimeoutError;
  }
  delete RACE_TIMEOUT_CANCELS[race_id];
};
