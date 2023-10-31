import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const PlayerShort = new SimpleSchema({
  id: String,
  alias: String,
  money: SimpleSchema.Integer,
  thumbnail_url: String,
});

const RouletteBetSlot = new SimpleSchema({
  bet_display: String,
  bet_values: Array,
  'bet_values.$': Number,
});

const RouletteBet = new SimpleSchema({
  bet_slot: RouletteBetSlot,
  player: PlayerShort,
});

const Roulette = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event) => event._id),
  },
  cost: SimpleSchema.Integer,
  bets_start_at: Date,
  spin_starts_at: Date,
  spin_ends_at: Date,
  result: SimpleSchema.Integer,
  status: {
    type: String,
    allowedValues: [
      'pre-spin',
      'start-spin',
      'spinning',
      'end-spin',
      'winners-board',
      'disabled',
    ],
  },

  bets: Array,
  'bets.$': RouletteBet,
});

export default Roulette;
