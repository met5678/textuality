import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { Event } from './event';

const PlayerShort = new SimpleSchema({
  id: String,
  alias: String,
  money: SimpleSchema.Integer,
  thumbnail_url: String,
});

const SlotMachine = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event: Event) => event._id),
  },
  hashtag: String,
  cost: SimpleSchema.Integer,
  machine_on_left: {
    type: String,
    optional: true,
  },
  machine_on_right: {
    type: String,
    optional: true,
  },
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
  result: {
    type: Array,
    minCount: 3,
    maxCount: 3,
    optional: true,
  },
  'result.$': {
    type: String,
  },
  win_amount: Number,
  player: {
    type: PlayerShort,
    optional: true,
  },
  player_queue: {
    type: Array,
  },
  'player_queue.$': PlayerShort,

  stats: Object,
  'stats.spin_count': SimpleSchema.Integer,
  'stats.profit': SimpleSchema.Integer,
});

export default SlotMachine;
