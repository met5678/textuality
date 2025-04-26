import { Meteor } from 'meteor/meteor';
import Events from './events';
import { Event, EventId } from '/imports/schemas/event';

const current = (): Event | undefined => {
  const events = Events.find({ active: true }).fetch();
  return events[0];
};

const currentOrThrow = (): Event => {
  const current = Events.current();
  if (!current) {
    throw new Meteor.Error('event-not-found', 'Event not active');
  }
  return current;
};

const currentId = (): EventId | undefined => {
  const currentEvent = current();
  return currentEvent ? currentEvent._id : undefined;
};

const currentIdOrThrow = (): EventId => {
  const current = currentOrThrow();
  return current._id;
};

const allIds = (): EventId[] => {
  return Events.find({}, { fields: { _id: 1 } })
    .fetch()
    .map((event) => event._id);
};

export { current, currentOrThrow, currentId, currentIdOrThrow, allIds };
