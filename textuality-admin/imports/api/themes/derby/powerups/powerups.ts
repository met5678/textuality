import { Mongo } from 'meteor/mongo';

import { Powerup, PowerupSchema } from '/imports/schemas/derby/powerup';

interface PowerupWithHelpers extends Powerup {}

const Powerups = new Mongo.Collection<Powerup, PowerupWithHelpers>(
  'derby_powerups',
);

Powerups.attachSchema(PowerupSchema);

export default Powerups;
export { PowerupWithHelpers };
