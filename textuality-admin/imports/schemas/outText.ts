import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const OutTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  body: String,
  time: Date,
  player: String,
  from_number: String,
  to_number: String,
  media_url: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['unsent', 'sending', 'sent', 'delivered', 'read'],
    defaultValue: 'unsent',
  },
  source: {
    type: String,
    allowedValues: ['auto', 'manual', 'achievement', 'mission', 'unknown'],
    defaultValue: 'unknown',
  },
});

interface OutText {
  _id?: string;
  event: string;
  body: string;
  media_url?: string;
  time: Date;
  player: string;
  from_number: string;
  to_number: string;
  status: 'unsent' | 'sending' | 'sent' | 'delivered' | 'read';
  source: 'auto' | 'manual' | 'achievement' | 'mission' | 'unknown';
}

export default OutTextSchema;
export { OutText, OutTextSchema };
