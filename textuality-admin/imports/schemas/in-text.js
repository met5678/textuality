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
  body: String,
  time: Date,
  player: {
    type: String,
    allowedValues: () => {
      Players.find()
        .fetch()
        .map(player => player._id);
    }
  },
  num_achievements: SimpleSchema.Integer,
  alias: String,
  avatar_url: {
    type: String,
    optional: true
  },
  purpose: {
    type: String,
    allowedValues: ['feed', 'achievement', 'mission', 'system']
  },
  moderation_score: {
    type: SimpleSchema.Integer,
    optional: true
  }
});

export default InTextSchema;
