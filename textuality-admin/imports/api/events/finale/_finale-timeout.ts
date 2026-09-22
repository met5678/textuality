import { Meteor } from 'meteor/meteor';
import { waitForSecondsCancellable } from '/imports/utils/async-wait-for';
import { EventId } from '/imports/schemas/event';

const FINALE_TIMEOUT_CANCELS: Partial<Record<EventId, () => void>> = {};

export const cancelAndDeleteTimeout = (event_id: EventId) => {
  if (FINALE_TIMEOUT_CANCELS[event_id]) {
    console.log('cancelling timeout', event_id);
    FINALE_TIMEOUT_CANCELS[event_id]();
  }
  delete FINALE_TIMEOUT_CANCELS[event_id];
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
  event_id: EventId,
  seconds: number,
) => {
  cancelAndDeleteTimeout(event_id);
  const [promise, cancel] = waitForSecondsCancellable(seconds);
  FINALE_TIMEOUT_CANCELS[event_id] = cancel;
  await promise;
  if (FINALE_TIMEOUT_CANCELS[event_id] !== cancel) {
    console.log('last timeout cancelled');
    throw TimeoutError;
  }
  delete FINALE_TIMEOUT_CANCELS[event_id];
};
