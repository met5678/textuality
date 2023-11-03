import { Mongo } from 'meteor/mongo';

import {
  AutoText as AutoTextOrig,
  AutoTextSchema,
} from '/imports/schemas/autoText';

interface AutoText extends AutoTextOrig {
  isNumeric: () => boolean;
}

const AutoTexts = new Mongo.Collection<AutoTextOrig, AutoText>('autoTexts');

AutoTexts.attachSchema(AutoTextSchema);

export default AutoTexts;
