import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { MissionId } from './mission';
import { EventId } from './event';

export const ROULETTE_NUMBER_MINIMUM = 0;
export const ROULETTE_NUMBER_MAXIMUM = 36;

export const RouletteSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  spin_seconds: {
    type: SimpleSchema.Integer,
    defaultValue: 45,
  },
  bets_cutoff_seconds: {
    type: SimpleSchema.Integer,
    defaultValue: 10,
    min: 0,
  },

  scheduled: {
    type: Boolean,
    defaultValue: false,
  },
  bets_start_at: {
    type: Date,
    optional: true,
  },
  spin_starts_at: {
    type: Date,
    optional: true,
  },

  result: {
    type: SimpleSchema.Integer,
    optional: true,
    min: ROULETTE_NUMBER_MINIMUM,
    max: ROULETTE_NUMBER_MAXIMUM,
  },
  status: {
    type: String,
    allowedValues: [
      'pre-spin',
      'start-spin',
      'spinning',
      'end-spin',
      'winners-board',
      'inactive',
    ],
    defaultValue: 'inactive',
  },
  bets_open: {
    type: Boolean,
    defaultValue: false,
  },

  number_payout_multiplier: {
    type: Number,
    defaultValue: 20,
  },

  special_payout_multiplier: {
    type: Number,
    defaultValue: 2,
  },

  linked_mission: {
    type: String,
    optional: true,
    // allowedValues: Missions.allIds
  },
});

export type RouletteStatus =
  | 'pre-spin'
  | 'start-spin'
  | 'spinning'
  | 'end-spin'
  | 'winners-board'
  | 'inactive';

export type RouletteId = string;

export type Roulette = {
  _id: RouletteId;
  event: EventId;
  spin_seconds: number;
  bets_cutoff_seconds: number;
  number_payout_multiplier: number;
  special_payout_multiplier: number;

  scheduled: true;
  bets_start_at?: Date;
  spin_starts_at?: Date;

  status: RouletteStatus;
  result?: number;
  bets_open: boolean;

  linked_mission?: MissionId;
};

export default RouletteSchema;
