import Roulettes from '../roulettes';
import Events from '/imports/api/events';
import { getWrappedServerMethodNoParams } from '/imports/utils/get-wrapped-server-method';

export const roulettesFindNext = async () => {
  const eventId = await Events.currentIdAsync();
  if (!eventId) return null;

  return Roulettes.findOneAsync(
    {
      event: eventId,
      bets_start_at: { $gt: new Date() },
    },
    {
      sort: { bets_start_at: 1 },
      limit: 1,
    },
  );
};

export const roulettesFindNextMethod = getWrappedServerMethodNoParams(
  'roulettes.findNext',
  roulettesFindNext,
);
