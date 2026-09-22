import { Mongo } from 'meteor/mongo';

import { Teller, TellerSchema } from '/imports/schemas/derby/teller';

interface TellerWithHelpers extends Teller {}

const Tellers = new Mongo.Collection<Teller, TellerWithHelpers>(
  'derby_tellers',
);

Tellers.attachSchema(TellerSchema);

export default Tellers;
export { TellerWithHelpers };
