import { Mongo } from 'meteor/mongo';

import AutoTextSchema from 'schemas/autoText';

const AutoTexts = new Mongo.Collection('autoTexts');

AutoTexts.attachSchema(AutoTextSchema);

export default AutoTexts;
