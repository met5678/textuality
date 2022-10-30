import { Mongo } from 'meteor/mongo';

import EventSchema from 'schemas/event';

const Events = new Mongo.Collection('events');

Events.attachSchema(EventSchema);

export default Events;
