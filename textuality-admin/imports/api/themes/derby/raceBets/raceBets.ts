import { Mongo } from 'meteor/mongo';

import { RaceBet, RaceBetSchema } from '../../../../schemas/derby/raceBet';

interface RaceBetWithHelpers extends RaceBet {
  totalWager(): number;
}

const RaceBets = new Mongo.Collection<RaceBet, RaceBetWithHelpers>(
  'derby_raceBets',
);

RaceBets.attachSchema(RaceBetSchema);

export default RaceBets;
export { RaceBetWithHelpers };
