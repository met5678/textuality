import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const OutTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  body: String,
  time: Date,
  players: {
    type: Array,
  },
  'players.$': String,
  source: {
    type: String,
    allowedValues: ['auto', 'manual', 'achievement', 'mission', 'unknown'],
  },
});

interface OutText {
  _id?: string;
  event: string;
  body: string;
  time: Date;
  players: string[];
  source: string;
}

export default OutTextSchema;
export { OutText, OutTextSchema };
