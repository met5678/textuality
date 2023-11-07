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
  'slot_spins.$': Object,
  'slot_spins.$.slot_id': String,
  'slot_spins.$.time_spun': Date,
  'slot_spins.$.cost': SimpleSchema.Integer,
  'slot_spins.$.win_amount': SimpleSchema.Integer,
  quests: {
    type: Array,
    defaultValue: [],
  },
  'quests.$': Object,
  'quests.$.quest_id': String,
  'quests.$.start_time': Date,
  'quests.$.complete_time': Date,
  'quests.$.is_complete': Boolean,
});

interface PlayerQuest {
  quest_id: string;
  start_time: Date;
  complete_time: Date;
  is_complete: boolean;
}

interface PlayerSlotSpin {
  slot_id: string;
  time_spun: Date;
  cost: number;
  win_amount: number;
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
  slot_spins: PlayerSlotSpin[];
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

export default PlayerSchema;
export {
  PlayerSchema,
  Player,
  PlayerBasic,
  PlayerCheckpoint,
  PlayerSlotSpin,
  PlayerQuest,
};
