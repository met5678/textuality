import { Mongo } from 'meteor/mongo';

import { AutoText, AutoTextSchema } from '/imports/schemas/autoText';

interface AutoTextWithHelpers extends AutoText {
  isNumeric: () => boolean;
}

const AutoTexts = new Mongo.Collection<AutoText, AutoTextWithHelpers>(
  'autoTexts',
);

AutoTexts.attachSchema(AutoTextSchema);

export default AutoTexts;
export { AutoTextWithHelpers };
