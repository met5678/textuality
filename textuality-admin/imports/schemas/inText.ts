import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
import { PlayerId } from './player';
import { MediaId } from './media';
import { OutTextId } from './outText';

const INTEXT_PURPOSES_BASE = [
  'initial',
  'feed',
  'system',
  'hashtag',
  'unknown',
  'ignore',
] as const;
type InTextPurposeBase = (typeof INTEXT_PURPOSES_BASE)[number];

const INTEXT_PURPOSES_CASINO = ['bet'] as const;
type InTextPurposeCasino = (typeof INTEXT_PURPOSES_CASINO)[number];

const INTEXT_PURPOSES_DERBY = ['teller', 'bet-step'] as const;
type InTextPurposeDerby = (typeof INTEXT_PURPOSES_DERBY)[number];

const INTEXT_PURPOSES = [
  ...INTEXT_PURPOSES_BASE,
  ...INTEXT_PURPOSES_CASINO,
  ...INTEXT_PURPOSES_DERBY,
] as const;
type InTextPurpose = (typeof INTEXT_PURPOSES)[number];

type InTextInteractive = {
  response_to?: OutTextId;
  value: string;
};

export type InTextId = string;

interface InText {
  _id: InTextId;
  event: EventId;
  body: string;
  time: Date;
  player: PlayerId;
  media?: MediaId;
  purpose: InTextPurpose;
  interactive?: InTextInteractive;
  numAchievements?: number;
  numCheckpoints?: number;
  alias?: string;
  avatar?: string;
}

const InTextInteractiveSchema = new SimpleSchema({
  response_to: {
    type: String,
    optional: true,
  },
  value: {
    type: String,
  },
});

const InTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  body: {
    type: String,
    optional: true,
  },
  time: Date,
  player: String,
  media: {
    type: String,
    optional: true,
  },
  purpose: {
    type: String,
    allowedValues: [...INTEXT_PURPOSES],
  },
  interactive: {
    type: InTextInteractiveSchema,
    optional: true,
  },
  numAchievements: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  numCheckpoints: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  alias: {
    type: String,
    optional: true,
  },
  avatar: {
    type: String,
    optional: true,
  },
});

export default InTextSchema;
export {
  InTextSchema,
  InTextInteractiveSchema,
  INTEXT_PURPOSES,
  INTEXT_PURPOSES_BASE,
  INTEXT_PURPOSES_CASINO,
  INTEXT_PURPOSES_DERBY,
};
export type {
  InText,
  InTextPurpose,
  InTextPurposeBase,
  InTextPurposeCasino,
  InTextPurposeDerby,
  InTextInteractive,
};
