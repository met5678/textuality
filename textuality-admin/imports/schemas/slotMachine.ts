import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
import { PlayerId } from './player';

export const SLOT_MACHINE_STATUSES = [
  'available',
  'spinning',
  'lose',
  'win-normal',
  'win-hacker-partial',
  'win-hacker-final',
  'disabled',
] as const;
export type SlotMachineStatus = (typeof SLOT_MACHINE_STATUSES)[number];

export const SLOT_MACHINE_EMOJIS = [
  '🍒',
  '💣',
  '💦',
  '🍆',
  '🍑',
  '🥴',
] as const;
export type SlotMachineEmoji = (typeof SLOT_MACHINE_EMOJIS)[number];

const resultSchemaFields = {
  result: {
    type: Array,
    minCount: 3,
    maxCount: 3,
    optional: true,
  },
  'result.$': {
    type: String,
    allowedValues: [...SLOT_MACHINE_EMOJIS],
  },
};

export const SlotMachineOddsSchema = new SimpleSchema({
  ...resultSchemaFields,
  payout_multiplier: SimpleSchema.Integer,
  odds: Number,
});

export type SlotMachineResult = [
  SlotMachineEmoji,
  SlotMachineEmoji,
  SlotMachineEmoji,
];

export const SlotPlayerSchema = new SimpleSchema({
  id: String,
  alias: String,
  money: SimpleSchema.Integer,
  avatar_id: String,
});

export const SlotMachineSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  code: String,
  name: String,
  short: String,
  cost: SimpleSchema.Integer,
  status: {
    type: String,
    allowedValues: [...SLOT_MACHINE_STATUSES],
    defaultValue: 'available',
  },
  ...resultSchemaFields,
  win_amount: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  player: {
    type: SlotPlayerSchema,
    optional: true,
  },

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

export type SlotPlayer = {
  id: PlayerId;
  alias: string;
  money: number;
  avatar_id: string;
};

export type SlotMachineStats = {
  spin_count: number;
  profit: number;
};

export type SlotMachineOdds = {
  result: SlotMachineResult;
  payout_multiplier: number;
  odds: number;
};

export type SlotMachineId = string;

export type SlotMachine = {
  _id: SlotMachineId;
  event: EventId;
  code: string;
  name: string;
  short: string;
  cost: number;
  odds: SlotMachineOdds[];

  status: SlotMachineStatus;
  result?: SlotMachineResult;
  win_amount?: number;
  player?: SlotPlayer;
  stats: SlotMachineStats;
};

export default SlotMachineSchema;
