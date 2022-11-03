import { Meteor } from 'meteor/meteor';

import Rounds from '../';

Meteor.publish('rounds.current', function () {
  this.autorun(() => {
    const curRoundId = Rounds.currentId();
    if (curRoundId) {
      return Rounds.find(curRoundId);
    } else {
      return this.ready();
    }
  });
});
