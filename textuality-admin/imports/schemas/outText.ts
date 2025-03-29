import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
import { PlayerId } from './player';

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
  external_id: {
    type: String,
    optional: true,
  },
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
    allowedValues: ['nosend', 'unsent', 'sending', 'sent', 'delivered', 'read'],
    defaultValue: 'unsent',
  },
});

type OutTextStatus =
  | 'nosend'
  | 'unsent'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read';

export type OutTextId = string;

interface OutText {
  _id: OutTextId;
  event: EventId;
  body: string;
  media_url?: string;
  time: Date;
  player_id: PlayerId;
  player_alias: string;
  player_number: string;
  status: OutTextStatus;
  external_id?: string;
}

export default OutTextSchema;
export { OutText, OutTextSchema, OutTextStatus };
