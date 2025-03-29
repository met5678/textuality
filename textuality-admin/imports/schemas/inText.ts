import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
import { PlayerId } from './player';
import { MediaId } from './media';

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
    allowedValues: [
      'initial',
      'feed',
      'system',
      'hashtag',
      'percent',
      'bet',
      'mediaOnly',
      'ignore',
    ],
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

type InTextPurpose =
  | 'initial'
  | 'feed'
  | 'system'
  | 'hashtag'
  | 'percent'
  | 'bet'
  | 'mediaOnly'
  | 'ignore';

export type InTextId = string;

interface InText {
  _id: InTextId;
  event: EventId;
  body: string;
  time: Date;
  player: PlayerId;
  media?: MediaId;
  purpose: InTextPurpose;
  numAchievements?: number;
  numCheckpoints?: number;
  alias?: string;
  avatar?: string;
}

export default InTextSchema;
export { InText, InTextSchema, InTextPurpose };
