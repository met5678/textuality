import SimpleSchema from 'simpl-schema';

import Events from 'api/events';
import Players from 'api/players';

const InTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  body: {
    type: String,
    optional: true
  },
  time: Date,
  player: {
    type: String,
    allowedValues: () => {
      Players.find()
        .fetch()
        .map(player => player._id);
    }
  },
  media: {
    type: String,
    optional: true
  },
  numAchievements: SimpleSchema.Integer,
  numCheckpoints: SimpleSchema.Integer,
  alias: String,
  avatar: {
    type: String,
    optional: true
  },
  purpose: {
    type: String,
    allowedValues: [
      'initial',
      'feed',
      'system',
      'hashtag',
      'mediaOnly',
      'ignore'
    ]
  },
  purposeDetail: {
    type: String,
    optional: true
  },
  moderation_score: {
    type: SimpleSchema.Integer,
    optional: true
  }
});

export default InTextSchema;
