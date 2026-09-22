import Roulettes from '../roulettes';
import Events from '/imports/api/events';
import { getWrappedServerMethodNoParams } from '/imports/utils/get-wrapped-server-method';

export const roulettesFindCurrent = async () => {
  const eventId = await Events.currentIdAsync();
  if (!eventId) return undefined;

  return Roulettes.findOneAsync({
    event: eventId,
    status: { $ne: 'inactive' },
  });
};

export const roulettesFindCurrentMethod = getWrappedServerMethodNoParams(
  'roulettes.findCurrent',
  roulettesFindCurrent,
);
