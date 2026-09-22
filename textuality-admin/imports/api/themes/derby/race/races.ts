import { Mongo } from 'meteor/mongo';

import { Race, RaceSchema } from '/imports/schemas/derby/race';

interface RaceWithHelpers extends Race {
  isActive(): boolean;
}

const Races = new Mongo.Collection<Race, RaceWithHelpers>('derby_races');

Races.attachSchema(RaceSchema);

export default Races;
export { RaceWithHelpers };
