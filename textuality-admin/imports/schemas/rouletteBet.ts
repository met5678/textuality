import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { PlayerShort, PlayerShortSchema } from './player';

type RouletteBetSlot = number | 'even' | 'odd' | 'red' | 'black';

const RouletteBetSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  roulette_id: String,
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

interface RouletteBet {
  _id?: string;
  event: string;
  roulette_id: string;
  bet_slot: RouletteBetSlot;
  wager: number;
  player: PlayerShort;
  time: Date;
}

export default RouletteBetSchema;
export { RouletteBetSchema, RouletteBet };
