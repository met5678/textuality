import { Mongo } from 'meteor/mongo';

import { AutoText, AutoTextSchema } from '/imports/schemas/autoText';

const AutoTexts = new Mongo.Collection<AutoText>('autoTexts');

AutoTexts.attachSchema(AutoTextSchema);

export default AutoTexts;
