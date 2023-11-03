import { Meteor } from 'meteor/meteor';

import AutoTexts from './autoTexts';
import { AutoText } from '/imports/schemas/autoText';

Meteor.methods({
  'autoTexts.new': (autoText: AutoText) => {
    AutoTexts.insert(autoText);
  },

  'autoTexts.update': (autoText: Partial<AutoText>) => {
    AutoTexts.update(autoText._id!, { $set: autoText });
  },

  'autoTexts.delete': (autoTextId: string | string[]) => {
    if (Array.isArray(autoTextId)) {
      AutoTexts.remove({ _id: { $in: autoTextId } });
    } else {
      AutoTexts.remove(autoTextId);
    }
  },
});
