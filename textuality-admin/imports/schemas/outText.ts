import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const OutTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  body: String,
  time: Date,
  player_id: String,
  player_alias: String,
  player_number: String,
  media_id: {
    type: String,
    optional: true,
  },
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
  player_id: string;
  player_alias: string;
  player_number: string;
  status: 'unsent' | 'sending' | 'sent' | 'delivered' | 'read';
  source: 'auto' | 'manual' | 'achievement' | 'mission' | 'unknown';
}

export default OutTextSchema;
export { OutText, OutTextSchema };
