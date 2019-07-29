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
  joined: {
    type: Date,
    defaultValue: new Date()
  },
  recent: {
    type: Date,
    defaultValue: new Date()
  },
  status: {
    type: 'String',
    allowedValues: ['tentative', 'active', 'quit', 'banned'],
    defaultValue: 'tentative'
  },
  alias: String,
  old_aliases: {
    type: Array,
    defaultValue: []
  },
  'old_aliases.$': String,
  is_admin: {
    type: Boolean,
    defaultValue: false
  },
  achievements: {
    type: Array,
    defaultValue: []
  },
  'achievements.$': {
    type: Object,
    blackbox: true
  },
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
