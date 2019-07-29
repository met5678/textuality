import { Mongo } from 'meteor/mongo';

import InTextSchema from 'schemas/in-text';

const InTexts = new Mongo.Collection('in-texts');

InTexts.attachSchema(InTextSchema);

export default InTexts;
