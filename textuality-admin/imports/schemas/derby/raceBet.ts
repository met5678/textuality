import SimpleSchema from 'simpl-schema';
import Events from '/imports/api/events';
import { EventId } from '../event';
import { PlayerId } from '../player';
import { HorseId } from './horse';
import { TellerId } from './teller';
import { RaceId } from './race';

const RACE_BET_TYPES = [
  'win',
  'exacta',
  'trifecta',
  'exacta-box',
  'trifecta-box',
] as const;
type RaceBetType = (typeof RACE_BET_TYPES)[number];

const RACE_BET_STEPS = [
  'bet-type',
  'horse1',
  'horse2',
  'horse3',
  'wager',
  'confirm',
  'complete',
] as const;
type RaceBetStep = (typeof RACE_BET_STEPS)[number];

const RACE_BET_STATUS = [
  'pending',
  'placed',
  'cancelled',
  'completed',
  'lost',
  'won',
] as const;
type RaceBetStatus = (typeof RACE_BET_STATUS)[number];

type RaceBetId = string;

type RaceBet = {
  _id: RaceBetId;
  event: EventId;
  player: PlayerId;
  teller: TellerId;
  race: RaceId;
  wager: number;
  type: RaceBetType;
  placed_at?: Date;
  horses: HorseId[];
  status: RaceBetStatus;
  step: RaceBetStep;
};

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
  race: {
    type: String,
  },
  wager: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  type: {
    type: String,
    allowedValues: [...RACE_BET_TYPES],
  },
  placed_at: {
    type: Date,
    optional: true,
  },
  horses: {
    type: Array,
    defaultValue: [],
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
export type { RaceBetId, RaceBet, RaceBetType, RaceBetStep, RaceBetStatus };
export { RACE_BET_TYPES, RACE_BET_STEPS, RACE_BET_STATUS };
