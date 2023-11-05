import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const PlayerShortSchema = new SimpleSchema({
  id: String,
  alias: String,
  money: SimpleSchema.Integer,
  avatar_id: String,
});

const RouletteBetSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  roulette: String,
  bet: String,
  player: PlayerShortSchema,
  time: Date,
  value: SimpleSchema.Integer,
});

interface PlayerShort {
  id: string;
  alias: string;
  money: number;
  avatar_id: string;
}

interface RouletteBet {
  _id?: string;
  event: string;
  roulette: string;
  bet: string;
  player: PlayerShort;
  time: Date;
  value: number;
}

export default RouletteBetSchema;
export { RouletteBetSchema, RouletteBet, PlayerShort };
