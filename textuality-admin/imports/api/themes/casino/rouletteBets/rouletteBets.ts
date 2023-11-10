import { Mongo } from 'meteor/mongo';

import { RouletteBet, RouletteBetSchema } from '/imports/schemas/rouletteBet';

interface RouletteBetWithHelpers extends RouletteBet {
  isNumberBet(): boolean;
  isColorBet(): boolean;
  isOddEvenBet(): boolean;
  isSpecialBet(): boolean;
}

const RouletteBets = new Mongo.Collection<RouletteBet, RouletteBetWithHelpers>(
  'rouletteBets',
);

RouletteBets.attachSchema(RouletteBetSchema);

export default RouletteBets;
export { RouletteBetWithHelpers };
