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

  'autoTexts.copyFrom': (destinationEventId: string, sourceEventId: string) => {
    // First, delete existing achievements in the destination event
    AutoTexts.remove({ event: destinationEventId });

    const sourceAutoTexts = AutoTexts.find({ event: sourceEventId }).fetch();
    console.log('here', sourceAutoTexts);
    sourceAutoTexts.forEach((sourceAutoText) => {
      console.log('sourceAutoText', sourceAutoText);
      const destinationAutoText = {
        ...sourceAutoText,
        event: destinationEventId,
      };
      delete destinationAutoText._id;
      AutoTexts.insert(destinationAutoText);
    });
  },
});
