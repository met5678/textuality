import { Mongo } from 'meteor/mongo';

import OutTextSchema from 'schemas/outText';

const OutTexts = new Mongo.Collection('outTexts');

OutTexts.attachSchema(OutTextSchema);

export default OutTexts;
