import { Meteor } from 'meteor/meteor';
import { SlotMachineId } from '/imports/schemas/slotMachine';

const SLOT_TIMEOUT_CANCELS: Partial<Record<SlotMachineId, () => void>> = {};

export const TimeoutError = new Meteor.Error(
  'slot-timeout-cancelled',
  'Slot timeout cancelled',
);

export const cancelAndDeleteTimeout = (slot_id: SlotMachineId) => {
  const cancel = SLOT_TIMEOUT_CANCELS[slot_id];
  if (!cancel) return;

  delete SLOT_TIMEOUT_CANCELS[slot_id];
  cancel();
};

/**
 * This function cancels any existing timeout, creates a new one, and throws an error
 * if the new timeout is cancelled.
 * @param slot_id - The id of the slot machine to throw the timeout for
 * @param seconds - How long the timeout should be
 */
export const throwIfCancelledTimeout = async (
  slot_id: SlotMachineId,
  seconds: number,
) => {
  cancelAndDeleteTimeout(slot_id);

  let cancel!: () => void;
  const promise = new Promise<void>((resolve, reject) => {
    const timeoutId = Meteor.setTimeout(resolve, seconds * 1000);
    cancel = () => {
      Meteor.clearTimeout(timeoutId);
      reject(TimeoutError);
    };
  });

  SLOT_TIMEOUT_CANCELS[slot_id] = cancel;

  try {
    await promise;
    if (SLOT_TIMEOUT_CANCELS[slot_id] !== cancel) {
      throw TimeoutError;
    }
  } finally {
    if (SLOT_TIMEOUT_CANCELS[slot_id] === cancel) {
      delete SLOT_TIMEOUT_CANCELS[slot_id];
    }
  }
};
