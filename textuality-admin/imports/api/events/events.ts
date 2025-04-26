import { Mongo } from 'meteor/mongo';

import { EventSchema, Event, EventId } from '/imports/schemas/event';
import {
  current,
  currentOrThrow,
  currentId,
  currentIdOrThrow,
  allIds,
} from './helpers';

interface EventsCollection extends Mongo.Collection<Event> {
  current: () => Event | undefined;
  currentOrThrow: () => Event;
  currentId: () => EventId | undefined;
  currentIdOrThrow: () => EventId;
  allIds: () => EventId[];
}

const Events: EventsCollection = Object.assign(
  new Mongo.Collection<Event>('events'),
  { current, currentOrThrow, currentId, currentIdOrThrow, allIds },
);

Events.attachSchema(EventSchema);

export default Events;
