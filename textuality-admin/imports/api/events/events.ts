import { Mongo } from 'meteor/mongo';

import { EventSchema, Event, EventId } from '/imports/schemas/event';
import { current, currentId, allIds } from './helpers';

interface EventsCollection extends Mongo.Collection<Event> {
  current: () => Event | undefined;
  currentId: () => EventId | undefined;
  allIds: () => EventId[];
}

const Events: EventsCollection = Object.assign(
  new Mongo.Collection<Event>('events'),
  { current, currentId, allIds },
);

Events.attachSchema(EventSchema);

export default Events;
