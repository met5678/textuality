import { Meteor } from 'meteor/meteor';

import Rounds from './rounds';

Meteor.methods({
  'rounds.new': (round) => {
    const id = Rounds.insert(round);
  },

  'rounds.update': (round) => {
    Rounds.update(round._id, { $set: round });
  },

  'rounds.delete': (roundId) => {
    if (Array.isArray(roundId)) {
      Rounds.remove({ _id: { $in: roundId } });
    } else {
      Rounds.remove(roundId);
    }
  },

  'rounds.resetEvent': () => {
    Rounds.update(
      { event: Events.currentId() },
      { $set: { active: false } },
      { multi: true }
    );
  },
});
