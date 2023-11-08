import { Mongo } from 'meteor/mongo';

import { Roulette, RouletteSchema } from '/imports/schemas/roulette';

interface RouletteWithHelpers extends Roulette {}

const Roulettes = new Mongo.Collection<Roulette, RouletteWithHelpers>(
  'roulettes',
);

Roulettes.attachSchema(RouletteSchema);

export default Roulettes;
export { RouletteWithHelpers };
