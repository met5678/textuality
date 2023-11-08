import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const PlayerShortSchema = new SimpleSchema({
  id: String,
  alias: String,
  money: SimpleSchema.Integer,
  avatar_id: String,
});

type RouletteBetSlot = number | 'even' | 'odd' | 'red' | 'black';

const RouletteBetSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  roulette: String,
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
  },
  wager: SimpleSchema.Integer,
  player: PlayerShortSchema,
  time: Date,
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
  bet_slot: RouletteBetSlot;
  wager: number;
  player: PlayerShort;
  time: Date;
}

export default RouletteBetSchema;
export { RouletteBetSchema, RouletteBet, PlayerShort };
