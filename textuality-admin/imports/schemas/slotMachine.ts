import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { Event } from './event';

const SlotMachineEmojis: SlotMachineEmoji[] = [
  '🍒',
  '💣',
  '💦',
  '🍆',
  '🍑',
  '🥴',
];
type SlotMachineEmoji = '🍒' | '💣' | '💦' | '🍆' | '🍑' | '🥴';

const resultSchemaFields = {
  result: {
    type: Array,
    minCount: 3,
    maxCount: 3,
    optional: true,
  },
  'result.$': {
    type: String,
    allowedValues: SlotMachineEmojis,
  },
};

const SlotMachineOddsSchema = new SimpleSchema({
  ...resultSchemaFields,
  payout_multiplier: SimpleSchema.Integer,
  odds: Number,
});

type SlotMachineResult = [SlotMachineEmoji, SlotMachineEmoji, SlotMachineEmoji];

const SlotMachineSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
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
    defaultValue: 'available',
  },
  ...resultSchemaFields,
  win_amount: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  player: {
    type: Object,
    optional: true,
  },
  'player.id': String,
  'player.alias': String,
  'player.money': SimpleSchema.Integer,
  'player.avatar_id': String,
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

  stats: {
    type: Object,
    defaultValue: {
      spin_count: 0,
      profit: 0,
    },
  },
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
  odds: SlotMachineOdds[];

  status: SlotMachineStatus;
  result?: SlotMachineResult;
  win_amount?: number;
  player?: PlayerShort;
  stats: SlotMachineStats;
  // player_queue: PlayerShort[];
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
  SlotMachineEmojis,
  resultSchemaFields,
};
