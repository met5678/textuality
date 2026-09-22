import { Mongo } from 'meteor/mongo';

import { EventSchema, Event, EventId } from '/imports/schemas/event';
import {
  current,
  currentOrThrow,
  currentId,
  currentIdOrThrow,
  allIds,
  allIdsAsync,
  currentAsync,
  currentIdAsync,
  currentIdOrThrowAsync,
  currentOrThrowAsync,
} from './helpers';

interface EventsCollection extends Mongo.Collection<Event> {
  current: () => Event | undefined;
  currentOrThrow: () => Event;
  currentId: () => EventId | undefined;
  currentIdOrThrow: () => EventId;
  allIds: () => EventId[];
  currentAsync: () => Promise<Event | undefined>;
  currentOrThrowAsync: () => Promise<Event>;
  currentIdAsync: () => Promise<EventId | undefined>;
  currentIdOrThrowAsync: () => Promise<EventId>;
  allIdsAsync: () => Promise<EventId[]>;
}

const Events: EventsCollection = Object.assign(
  new Mongo.Collection<Event>('events'),
  {
    current,
    currentOrThrow,
    currentId,
    currentIdOrThrow,
    allIds,
    currentAsync,
    currentOrThrowAsync,
    currentIdAsync,
    currentIdOrThrowAsync,
    allIdsAsync,
  },
);

Events.attachSchema(EventSchema);

export default Events;
