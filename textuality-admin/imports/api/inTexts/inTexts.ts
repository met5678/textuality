import { Mongo } from 'meteor/mongo';

import InTextSchema from '/imports/schemas/inText';

const InTexts = new Mongo.Collection('inTexts');

InTexts.attachSchema(InTextSchema);

export default InTexts;
