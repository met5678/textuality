import { Meteor } from 'meteor/meteor';

import Guesses from '../';
import Events from 'api/events';
import Rounds from 'api/rounds';

Meteor.publish('guesses.latest', function (n) {
  this.autorun(() =>
    Guesses.find(
      { event: Events.currentId(), round: Rounds.currentId() },
      {
        sort: { time: -1 },
        limit: n,
      }
    )
  );
});
