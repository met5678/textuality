import { Mongo } from 'meteor/mongo';

import { Horse, HorseSchema } from '/imports/schemas/derby/horse';

interface HorseWithHelpers extends Horse {}

const Horses = new Mongo.Collection<Horse, HorseWithHelpers>('derby_horses');

Horses.attachSchema(HorseSchema);

export default Horses;
export { HorseWithHelpers };
