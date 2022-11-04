import { Meteor } from 'meteor/meteor';

import Guesses from './guesses';
import Events from 'api/events';
import Rounds from 'api/rounds';

Meteor.methods({
  'guesses.update': (guess) => {
    Guesses.update(guess._id, {
      $set: guess,
    });
  },

  'guesses.delete': (guessId) => {
    if (Array.isArray(guessId)) {
      Guesses.remove({ _id: { $in: guessId } });
    } else {
      Guesses.remove(guessId);
    }
  },

  'guesses.resetRound': ({ roundId = Rounds.currentId() } = {}) => {
    Guesses.remove({ event: Events.currentId(), round: roundId });
  },

  'guesses.resetEvent': () => {
    Guesses.remove({ event: Events.currentId() });
  },
});
