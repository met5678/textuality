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
  'broadcast',
  'unknown',
] as const;
type OutTextSource = (typeof OUT_TEXT_SOURCE)[number];

type OutTextInteractivePayloadOption = {
  value: string;
  label: string;
  description?: string;
};

type OutTextInteractivePayload = {
  type: 'buttons' | 'list';
  options: OutTextInteractivePayloadOption[];
  list_button_label?: string;
};

export type OutTextId = string;

interface OutText {
  _id: OutTextId;
  event: EventId;
  body: string;
  media_url?: string;
  interactive?: OutTextInteractivePayload;
  time: Date;
  player_id: PlayerId;
  player_alias: string;
  player_number: string;
  status: OutTextStatus;
  external_id?: string;
  source?: OutTextSource;
}

const OutTextInteractivePayloadOptionSchema = new SimpleSchema({
  value: {
    type: String,
    defaultValue: 'backend-value',
  },
  label: {
    type: String,
    defaultValue: 'User Facing Label',
  },
  description: {
    type: String,
    optional: true,
  },
});

const OutTextInteractivePayloadSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['buttons', 'list'],
  },
  options: {
    type: Array,
    minCount: 1,
    defaultValue: [
      {
        value: 'backend-value',
        label: 'User Facing Label',
      },
    ],
  },
  'options.$': {
    type: OutTextInteractivePayloadOptionSchema,
  },
  list_button_label: {
    type: String,
    optional: true,
  },
});

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
  media_url: {
    type: String,
    optional: true,
  },
  interactive: {
    type: OutTextInteractivePayloadSchema,
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

export default OutTextSchema;
export {
  OutTextSchema,
  OutTextInteractivePayloadSchema,
  OutTextInteractivePayloadOptionSchema,
  OUT_TEXT_STATUS,
  OUT_TEXT_SOURCE,
};
export type {
  OutText,
  OutTextStatus,
  OutTextSource,
  OutTextInteractivePayload,
  OutTextInteractivePayloadOption,
};
