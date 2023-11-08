import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

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
  | 'mediaOnly'
  | 'ignore';

interface InText {
  _id?: string;
  event: string;
  body: string;
  time: Date;
  player: string;
  media?: string;
  purpose: InTextPurpose;
  numAchievements?: number;
  numCheckpoints?: number;
  alias?: string;
  avatar?: string;
}

export default InTextSchema;
export { InText, InTextSchema, InTextPurpose };
