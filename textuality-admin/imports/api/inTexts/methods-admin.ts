import { Meteor } from 'meteor/meteor';

import InTexts from './inTexts';

Meteor.methods({
  'inTexts.update': (inText) => {
    InTexts.update(inText._id, { $set: inText });
  },

  'inTexts.delete': (inTextId) => {
    if (Array.isArray(inTextId)) {
      InTexts.remove({ _id: { $in: inTextId } });
    } else {
      InTexts.remove(inTextId);
    }
  },

  'inTexts.resetEvent': (eventId: string) => {
    if (!eventId) return;
    InTexts.remove({ event: eventId });
  },
});
