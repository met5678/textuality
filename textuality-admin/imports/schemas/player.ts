import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import Media from 'api/media';

const PlayerSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  phoneNumber: String,
  joined: {
    type: Date,
    defaultValue: new Date(),
  },
  recent: {
    type: Date,
    defaultValue: new Date(),
  },
  status: {
    type: 'String',
    allowedValues: ['new', 'tentative', 'active', 'inactive', 'quit', 'banned'],
    defaultValue: 'new',
  },
  alias: String,
  oldAliases: {
    type: Array,
    defaultValue: [],
  },
  'oldAliases.$': String,
  isAdmin: {
    type: Boolean,
    defaultValue: false,
  },
  checkpoints: {
    type: Array,
    defaultValue: [],
  },
  'checkpoints.$': {
    type: Object,
  },
  'checkpoints.$.checkpoint': String,
  'checkpoints.$.group': String,
  'checkpoints.$.hashtag': String,
  'checkpoints.$.time': Date,
  numAchievements: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  numClues: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  feedTextsSent: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  feedMediaSent: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  avatar: {
    type: String,
    optional: true,
    allowedValues: () =>
      Media.find({ event: Events.currentId() })
        .fetch()
        .map((media) => media._id),
  },
  money: SimpleSchema.Integer,
});

interface PlayerBase {
  _id: string;
  phoneNumber: string;
  avatar: string;
  money: number;
}

export default PlayerSchema;
export { PlayerBase };