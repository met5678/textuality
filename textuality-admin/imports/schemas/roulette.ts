import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const RouletteSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  cost: SimpleSchema.Integer,
  bets_start_at: {
    type: Date,
    optional: true,
  },
  bets_end_at: {
    type: Date,
    optional: true,
  },
  spin_starts_at: {
    type: Date,
    optional: true,
  },
  spin_ends_at: {
    type: Date,
    optional: true,
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
  cost: number;
  bets_start_at?: Date;
  spin_starts_at?: Date;
  bets_end_at?: Date;
  spin_ends_at?: Date;
  result?: number;
  status: RouletteStatus;
}

export default RouletteSchema;
export { Roulette, RouletteSchema };
