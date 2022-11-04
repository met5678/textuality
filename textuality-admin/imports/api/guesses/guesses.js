import { Mongo } from 'meteor/mongo';

import GuessSchema from 'schemas/guess';

const Guesses = new Mongo.Collection('guesses');

Guesses.attachSchema(GuessSchema);

export default Guesses;
