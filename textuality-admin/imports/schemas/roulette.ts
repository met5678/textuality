import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const RouletteSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  minimum_bet: SimpleSchema.Integer,
  bets_start_at: {
    type: Date,
    optional: true,
  },
  spin_starts_at: {
    type: Date,
    optional: true,
  },
  spin_seconds: {
    type: SimpleSchema.Integer,
    defaultValue: 120,
  },
  bets_cutoff_seconds: {
    type: SimpleSchema.Integer,
    defaultValue: 10,
  },
  result: {
    type: SimpleSchema.Integer,
    optional: true,
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

  bets_started_at: {
    type: Date,
    optional: true,
  },
  spin_started_at: {
    type: Date,
    optional: true,
  },
  bets_ended_at: {
    type: Date,
    optional: true,
  },
  spin_ended_at: {
    type: Date,
    optional: true,
  },

  bets_open: {
    type: Boolean,
    defaultValue: false,
  },
});

type RouletteStatus =
  | 'pre-spin'
  | 'start-spin'
  | 'spinning'
  | 'end-spin'
  | 'winners-board'
  | 'inactive';

interface Roulette {
  _id?: string;
  event: string;
  minimum_bet: number;
  bets_start_at?: Date;
  spin_starts_at?: Date;
  spin_seconds: number;
  bets_cutoff_seconds: number;

  bets_started_at?: Date;
  spin_started_at?: Date;
  bets_ended_at?: Date;
  spin_ended_at?: Date;

  bets_open: boolean;

  result?: number;
  status: RouletteStatus;
}

export default RouletteSchema;
export { Roulette, RouletteSchema, RouletteStatus };
