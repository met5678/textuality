import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const PlayerSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  phone_number: String,
  joined: Date,
  last_active: Date,
  alias: String,
  old_aliases: [String],
  is_admin: {
    type: Boolean,
    defaultValue: false
  },
  achievements: [],
  texts_sent: {
    type: SimpleSchema.Integer,
    defaultValue: 0
  },
  texts_received: {
    type: SimpleSchema.Integer,
    defaultValue: 0
  },
  avatar_url: {
    type: String,
    optional: true
  }
});

export default PlayerSchema;
