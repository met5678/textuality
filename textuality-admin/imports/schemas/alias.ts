import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';

const AliasSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () => Events.allIds(),
  },
  name: String,
  used: Boolean,
});

export type AliasId = string;

interface Alias {
  _id: AliasId;
  event: EventId;
  name: string;
  used: boolean;
}

export default AliasSchema;
export { Alias, AliasSchema };
