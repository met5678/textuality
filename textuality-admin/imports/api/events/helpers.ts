import Events from './events';
import { EventId } from '/imports/schemas/event';

const current = () => {
  const events = Events.find({ active: true }).fetch();
  return events[0];
};

const currentId = (): EventId | undefined => {
  const current = Events.current!();
  return current ? current._id : undefined;
};

const allIds = (): EventId[] => {
  return Events.find({}, { fields: { _id: 1 } })
    .fetch()
    .map((event) => event._id);
};

export { current, currentId, allIds };
