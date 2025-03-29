import Events from './events';
import { EventId } from '/imports/schemas/event';

const current = () => {
  return Events.findOne({ active: true });
};

const currentId = (): EventId | null => {
  const current = Events.current!();
  return current ? current._id : null;
};

const allIds = (): EventId[] => {
  return Events.find({}, { fields: { _id: 1 } })
    .fetch()
    .map((event) => event._id);
};

export { current, currentId, allIds };
