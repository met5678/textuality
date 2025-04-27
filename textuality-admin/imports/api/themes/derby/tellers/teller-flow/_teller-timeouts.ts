import { Meteor } from 'meteor/meteor';
import { waitForSecondsCancellable } from '/imports/utils/async-wait-for';
import { TellerId } from '/imports/schemas/derby/teller';

const TELLER_TIMEOUT_CANCELS: Partial<Record<TellerId, () => void>> = {};

const cancelAndDeleteTimeout = (teller_id: TellerId) => {
  if (TELLER_TIMEOUT_CANCELS[teller_id]) {
    console.log('cancelling timeout', teller_id);
    TELLER_TIMEOUT_CANCELS[teller_id]();
  }
  delete TELLER_TIMEOUT_CANCELS[teller_id];
};

export const TimeoutError = new Meteor.Error(
  'teller-timeout-cancelled',
  'Teller timeout cancelled',
);

/**
 * This function cancels any existing timeout, creates a new one, and throws an error
 * if the new timeout is cancelled.
 * @param teller_id - The id of the teller to throw the timeout for
 * @param seconds - How long the timeout should be
 */
export const throwIfCancelledTimeout = async (
  teller_id: TellerId,
  seconds: number,
) => {
  cancelAndDeleteTimeout(teller_id);
  const [promise, cancel] = waitForSecondsCancellable(seconds);
  TELLER_TIMEOUT_CANCELS[teller_id] = cancel;
  await promise;
  if (TELLER_TIMEOUT_CANCELS[teller_id] !== cancel) {
    console.log('last timeout cancelled');
    throw TimeoutError;
  }
  delete TELLER_TIMEOUT_CANCELS[teller_id];
};
