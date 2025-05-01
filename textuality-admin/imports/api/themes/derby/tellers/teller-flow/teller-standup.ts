import Tellers from '../tellers';
import { throwIfCancelledTimeout, TimeoutError } from './_teller-timeouts';
import { TELLER_VIDEO_LENGTHS } from '/imports/schemas/derby/teller-status/teller-status';

export const tellerStandup = async (teller_id: string) => {
  const teller = await Tellers.findOneAsync(teller_id);
  if (!teller) {
    console.warn(`Can't standup teller ${teller_id} because it doesn't exist`);
    return;
  }

  if (teller.status !== 'break') {
    console.warn(
      `Can't standup teller ${teller_id} because they're not on break`,
    );
    return;
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
};
