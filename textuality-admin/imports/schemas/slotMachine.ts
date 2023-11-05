import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { Event } from './event';

const PlayerShort = new SimpleSchema({
  id: String,
  alias: String,
  money: SimpleSchema.Integer,
  avatar_id: String,
});

const SlotMachineSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event: Event) => event._id),
  },
  code: String,
  name: String,
  cost: SimpleSchema.Integer,
  machine_on_left: {
    type: String,
    optional: true,
  },
  machine_on_right: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: [
      'available',
      'spinning',
      'lose',
      'win-normal',
      'win-hacker',
      'disabled',
    ],
  },
  result: {
    type: Array,
    minCount: 3,
    maxCount: 3,
    optional: true,
  },
  'result.$': {
    type: String,
  },
  win_amount: Number,
  // player: {
  //   type: PlayerShort,
  //   optional: true,
  //   defaultValue: null,
  // },
  player_queue: {
    type: Array,
    defaultValue: [],
  },
  'player_queue.$': PlayerShort,

  // stats: Object,
  // 'stats.spin_count': SimpleSchema.Integer,
  // 'stats.profit': SimpleSchema.Integer,
});

type SlotMachineStatus =
  | 'available'
  | 'spinning'
  | 'lose'
  | 'win-normal'
  | 'win-hacker'
  | 'disabled';

interface PlayerShort {
  id: string;
  alias: string;
  money: number;
  avatar_id: string;
}

interface SlotMachineStats {
  spin_count: number;
  profit: number;
}

interface SlotMachine {
  _id?: string;
  event: string;
  code: string;
  name: string;
  cost: number;
  machine_on_left?: string;
  machine_on_right?: string;
  status: SlotMachineStatus;
  result?: [string, string, string];
  win_amount: number;
  player?: PlayerShort;
  player_queue: PlayerShort[];
  // stats: SlotMachineStats;
}

export default SlotMachineSchema;
export { SlotMachineSchema, SlotMachine };
