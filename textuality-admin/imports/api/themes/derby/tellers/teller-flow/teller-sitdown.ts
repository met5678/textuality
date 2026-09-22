import Tellers from '../tellers';
import { throwIfCancelledTimeout, TimeoutError } from './_teller-timeouts';
import { TELLER_VIDEO_LENGTHS } from '/imports/schemas/derby/teller-status/teller-status';

export const tellerSitDown = async (teller_id: string) => {
  const teller = await Tellers.findOneAsync(teller_id);
  if (!teller) {
    console.warn(`Can't sitdown teller ${teller_id} because it doesn't exist`);
    return;
  }

  if (teller.status !== 'empty') {
    console.warn(
      `Can't sitdown teller '${teller.url}' because they're already sitting down.`,
    );
    return;
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
};
