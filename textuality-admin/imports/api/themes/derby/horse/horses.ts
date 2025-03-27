import { Mongo } from 'meteor/mongo';

import { Horse, HorseSchema } from '/imports/schemas/derby/horse';

interface HorseWithHelpers extends Horse {
  getTotalStats(): number;
}

const Horses = new Mongo.Collection<Horse, HorseWithHelpers>('horses');

Horses.attachSchema(HorseSchema);

export default Horses;
export { HorseWithHelpers };
