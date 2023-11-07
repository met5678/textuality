import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { Event } from './event';

const PlayerShort = new SimpleSchema({
  id: String,
  alias: String,
  money: SimpleSchema.Integer,
  avatar_id: String,
});

const resultSchemaFields = {
  result: {
    type: Array,
    minCount: 3,
    maxCount: 3,
    optional: true,
  },
  'result.$': {
    type: String,
    allowedValues: ['🍒', '💣', '💦', '🍆', '🍑', '🥴'],
  },
};

const SlotMachineOddsSchema = new SimpleSchema({
  ...resultSchemaFields,
  payout_multiplier: SimpleSchema.Integer,
  odds: Number,
});

type SlotMachineEmoji = '🍒' | '💣' | '💦' | '🍆' | '🍑' | '🥴';
type SlotMachineResult = [SlotMachineEmoji, SlotMachineEmoji, SlotMachineEmoji];

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
  ...resultSchemaFields,
  win_amount: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  player: {
    type: PlayerShort,
    optional: true,
    defaultValue: null,
  },
  // player_queue: {
  //   type: Array,
  //   defaultValue: [],
  // },
  // 'player_queue.$': PlayerShort,

  odds: {
    type: Array,
    defaultValue: [],
  },
  'odds.$': SlotMachineOddsSchema,

  stats: Object,
  'stats.spin_count': SimpleSchema.Integer,
  'stats.profit': SimpleSchema.Integer,
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

interface SlotMachineOdds {
  result: SlotMachineResult;
  payout_multiplier: number;
  odds: number;
}

interface SlotMachine {
  _id?: string;
  event: string;
  code: string;
  name: string;
  cost: number;
  status: SlotMachineStatus;
  result?: SlotMachineResult;
  win_amount?: number;
  player?: PlayerShort;
  // player_queue: PlayerShort[];
  odds: SlotMachineOdds[];
  stats: SlotMachineStats;
}

export default SlotMachineSchema;
export {
  SlotMachineSchema,
  SlotMachine,
  SlotMachineEmoji,
  SlotMachineResult,
  SlotMachineOdds,
  SlotMachineStatus,
  SlotMachineStats,
  resultSchemaFields,
};
