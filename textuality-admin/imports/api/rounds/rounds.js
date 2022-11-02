import { Mongo } from 'meteor/mongo';

import RoundSchema from 'schemas/round';

const Rounds = new Mongo.Collection('rounds');

Rounds.attachSchema(RoundSchema);

export default Rounds;
