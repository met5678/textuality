import { Meteor } from 'meteor/meteor';

import Clues from './clues';

Meteor.methods({
  'clues.new': (clue) => {
    const id = Clues.insert(clue);
  },

  'clues.update': (clue) => {
    Clues.update(clue._id, { $set: clue });
  },

  'clues.delete': (clueId) => {
    if (Array.isArray(clueId)) {
      Clues.remove({ _id: { $in: clueId } });
    } else {
      Clues.remove(clueId);
    }
  },

  'clues.resetEvent': () => {
    Clues.update(
      { event: Events.currentId() },
      { $set: { earned: 0 } },
      { multi: true }
    );
  },
});
