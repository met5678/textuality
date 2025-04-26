import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
import { PlayerId } from './player';

const OUT_TEXT_STATUS = [
  'nosend',
  'unsent',
  'sending',
  'api-sent',
  'sent',
  'delivered',
  'read',
] as const;
type OutTextStatus = (typeof OUT_TEXT_STATUS)[number];

const OUT_TEXT_SOURCE = [
  'auto',
  'manual',
  'achievement',
  'mission',
  'unknown',
] as const;
type OutTextSource = (typeof OUT_TEXT_SOURCE)[number];

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
    allowedValues: [...OUT_TEXT_STATUS],
    defaultValue: 'unsent',
  },
  source: {
    type: String,
    allowedValues: [...OUT_TEXT_SOURCE],
    defaultValue: 'unknown',
    optional: true,
  },
});

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
  source?: OutTextSource;
}

export default OutTextSchema;
export { OutTextSchema, OUT_TEXT_STATUS, OUT_TEXT_SOURCE };
export type { OutText, OutTextStatus, OutTextSource };
