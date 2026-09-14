import { Meteor } from 'meteor/meteor';
import Events from './events';
import { Event, EventId } from '/imports/schemas/event';

export const current = (): Event | undefined => {
  const events = Events.find({ active: true }).fetch();
  return events[0];
};

export const currentOrThrow = (): Event => {
  const current = Events.current();
  if (!current) {
    throw new Meteor.Error('event-not-found', 'Event not active');
  }
  return current;
};

export const currentId = (): EventId | undefined => {
  const currentEvent = current();
  return currentEvent ? currentEvent._id : undefined;
};

export const currentIdOrThrow = (): EventId => {
  const current = currentOrThrow();
  return current._id;
};

export const allIds = (): EventId[] => {
  return Events.find({}, { fields: { _id: 1 } })
    .fetch()
    .map((event) => event._id);
};

export const currentAsync = async (): Promise<Event | undefined> => {
  const events = await Events.find({ active: true }).fetchAsync();
  return events[0];
};

export const currentOrThrowAsync = async (): Promise<Event> => {
  const current = await currentAsync();
  if (!current) {
    throw new Meteor.Error('event-not-found', 'Event not active');
  }
  return current;
};

export const currentIdAsync = async (): Promise<EventId | undefined> => {
  const currentEvent = await currentAsync();
  return currentEvent ? currentEvent._id : undefined;
};

export const currentIdOrThrowAsync = async (): Promise<EventId> => {
  const current = await currentOrThrowAsync();
  return current._id;
};

export const allIdsAsync = async (): Promise<EventId[]> => {
  const events = await Events.find({}, { fields: { _id: 1 } }).fetchAsync();
  return events.map((event) => event._id);
};
