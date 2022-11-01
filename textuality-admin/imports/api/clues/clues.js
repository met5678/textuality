import { Mongo } from 'meteor/mongo';

import ClueSchema from 'schemas/clue';

const Clues = new Mongo.Collection('clues');

Clues.attachSchema(ClueSchema);

export default Clues;
