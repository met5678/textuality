import SimpleSchema from 'simpl-schema';
import Events from '/imports/api/events';
import { EventId } from '../event';
import { PlayerId } from '../player';
import { HorseId } from './horse';
import { TellerId } from './teller';
import { RaceId } from './race';
import { OutTextId } from '../outText';

const RACE_BET_TYPES = ['win', 'trifecta'] as const;
type RaceBetType = (typeof RACE_BET_TYPES)[number];

const RACE_BET_STEPS = [
  'bet-type',
  'horse1',
  'horse2',
  'horse3',
  'wager',
  'done',
] as const;
type RaceBetStep = (typeof RACE_BET_STEPS)[number];

const RACE_BET_STATUS = [
  'pending',
  'cancelled-user',
  'cancelled-timeout',
  'cancelled-race',
  'placed',
  'won',
  'lost',
] as const;
type RaceBetStatus = (typeof RACE_BET_STATUS)[number];

type RaceBetId = string;

type RaceBet = {
  _id: RaceBetId;
  event: EventId;
  player: PlayerId;
  teller: TellerId;
  teller_text_code: string;
  race: RaceId;
  status: RaceBetStatus;
  step: RaceBetStep;
  started_at: Date;

  // Optional until bet is placed
  type?: RaceBetType;
  horses?: HorseId[];
  base_bet?: number;
  count?: number;
  placed_at?: Date;
};

type RaceBetComplete = Required<RaceBet>;

const RaceBetSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  player: {
    type: String,
  },
  teller: {
    type: String,
  },
  teller_text_code: {
    type: String,
  },
  race: {
    type: String,
  },
  started_at: {
    type: Date,
  },
  placed_at: {
    type: Date,
    optional: true,
  },
  base_bet: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
    optional: true,
  },
  count: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: [...RACE_BET_TYPES],
    optional: true,
  },
  horses: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'horses.$': {
    type: String,
  },
  status: {
    type: String,
    allowedValues: [...RACE_BET_STATUS],
  },
  step: {
    type: String,
    allowedValues: [...RACE_BET_STEPS],
  },
});

export { RaceBetSchema };
export type {
  RaceBetId,
  RaceBet,
  RaceBetComplete,
  RaceBetType,
  RaceBetStep,
  RaceBetStatus,
};
export { RACE_BET_TYPES, RACE_BET_STEPS, RACE_BET_STATUS };
