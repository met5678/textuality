import SimpleSchema from 'simpl-schema';

import Events from 'api/events';
import Media from 'api/media';

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
    allowedValues: ['new', 'tentative', 'active', 'quit', 'banned'],
    defaultValue: 'new'
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
  checkpoints: {
    type: Array,
    defaultValue: []
  },
  'checkpoints.$': {
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
  avatar: {
    type: String,
    optional: true,
    allowedValues: () =>
      Media.find({ event: Events.currentId() })
        .fetch()
        .map(media => media._id)
  }
});

export default PlayerSchema;
