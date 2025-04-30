import { Mongo } from 'meteor/mongo';

import { Horse, HorseSchema, HorseStats } from '/imports/schemas/derby/horse';

interface HorseWithHelpers extends Horse {
  stats: () => HorseStats;
}

const Horses = new Mongo.Collection<Horse, HorseWithHelpers>('derby_horses');

Horses.attachSchema(HorseSchema);

export default Horses;
export { HorseWithHelpers };
