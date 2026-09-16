import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { PlayerShort, PlayerShortSchema } from './player';
import { EventId } from './event';
import { RouletteId } from './roulette';

export const ROULETTE_BET_SLOT_SPECIALS = [
  'even',
  'odd',
  'red',
  'black',
] as const;
export type RouletteBetSlotSpecial =
  (typeof ROULETTE_BET_SLOT_SPECIALS)[number];

export const isRouletteBetSlotSpecial = (
  value: string,
): value is RouletteBetSlotSpecial => {
  return ROULETTE_BET_SLOT_SPECIALS.some(
    (specialSlot) => value === specialSlot,
  );
};

export type RouletteBetSlot = number | RouletteBetSlotSpecial;

export type RouletteBetId = string;

export const ROULETTE_BET_STEPS = [
  'type',
  'number',
  'special',
  'wager',
  'done',
] as const;
export type RouletteBetStep = (typeof ROULETTE_BET_STEPS)[number];

export const ROULETTE_BET_STATUS = [
  'pending',
  'cancelled-user',
  'cancelled-roulette',
  'placed',
  'won',
  'lost',
] as const;
export type RouletteBetStatus = (typeof ROULETTE_BET_STATUS)[number];

export type RouletteBet = {
  _id: RouletteBetId;
  event: EventId;
  roulette_id: RouletteId;
  player: PlayerShort;
  win_payout: number;
  time: Date;

  status: RouletteBetStatus;
  step: RouletteBetStep;

  bet_slot?: RouletteBetSlot;
  wager?: number;
  placed_at?: Date;
};

export type RouletteBetComplete = Required<RouletteBet>;

export const RouletteBetSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  roulette_id: String,
  player: PlayerShortSchema,
  win_payout: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  time: Date,
  status: {
    type: String,
    allowedValues: [...ROULETTE_BET_STATUS],
  },
  step: {
    type: String,
    allowedValues: [...ROULETTE_BET_STEPS],
  },
  bet_slot: {
    type: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    allowedValues: () => {
      const slots: RouletteBetSlot[] = [];
      for (let i = 0; i <= 36; i++) {
        slots.push(i);
      }
      slots.push('even', 'odd', 'red', 'black');
      return slots;
    },
    optional: true,
  },
  wager: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  placed_at: {
    type: Date,
    optional: true,
  },
});

export default RouletteBetSchema;
