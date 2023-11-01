import { Mongo } from 'meteor/mongo';

import { OutText, OutTextSchema } from '/imports/schemas/outText';

const OutTexts = new Mongo.Collection<OutText>('outTexts');

OutTexts.attachSchema(OutTextSchema);

export default OutTexts;
