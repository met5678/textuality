import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import Media from '/imports/api/media';

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
  'checkpoints.$.id': String,
  'checkpoints.$.location': String,
  'checkpoints.$.hashtag': String,
  'checkpoints.$.time': Date,
  numAchievements: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  // numClues: {
  //   type: SimpleSchema.Integer,
  //   defaultValue: 0,
  // },
  // feedTextsSent: {
  //   type: SimpleSchema.Integer,
  //   defaultValue: 0,
  // },
  // feedMediaSent: {
  //   type: SimpleSchema.Integer,
  //   defaultValue: 0,
  // },
  avatar: {
    type: String,
    optional: true,
    allowedValues: () =>
      Media.find({ event: Events.currentId()! })
        .fetch()
        .map((media) => media._id),
  },
  money: SimpleSchema.Integer,
  slot_spins: {
    type: Array,
    defaultValue: [],
  },
  'slot_spins.$': String,
  quests: {
    type: Array,
    defaultValue: [],
  },
  'quests.$': Object,
  'quests.$.id': String,
  'quests.$.complete': Boolean,
  'quests.$.cheated': Boolean,
});

interface PlayerQuest {
  id: string;
  complete: boolean;
  cheated: boolean;
}

interface Player {
  _id?: string;
  event: string;
  phoneNumber: string;
  joined: Date;
  recent: Date;
  status: 'new' | 'tentative' | 'active' | 'inactive' | 'quit' | 'banned';
  alias: string;
  oldAliases: string[];
  isAdmin: boolean;
  checkpoints: PlayerCheckpoint[];
  numAchievements: number;
  // numClues: number;
  // feedTextsSent: number;
  // feedMediaSent: number;
  avatar?: string;
  money: number;
  slot_spins: string[];
  quests: PlayerQuest[];
}

interface PlayerCheckpoint {
  id: string;
  location: string;
  hashtag: string;
  time: Date;
}

interface PlayerBasic {
  _id?: string;
  phoneNumber: string;
  alias: string;
  avatar?: string;
  money: number;
}

const PlayerShortSchema = new SimpleSchema({
  id: String,
  alias: String,
  avatar_id: String,
  money: SimpleSchema.Integer,
});

interface PlayerShort {
  id: string;
  alias: string;
  avatar_id: string;
  money: number;
}

export default PlayerSchema;
export {
  PlayerSchema,
  PlayerShortSchema,
  Player,
  PlayerBasic,
  PlayerCheckpoint,
  PlayerQuest,
  PlayerShort,
};
