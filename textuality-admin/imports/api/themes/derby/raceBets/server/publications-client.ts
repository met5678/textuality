import { Meteor } from 'meteor/meteor';

import RaceBets from '../raceBets';
import Events from '/imports/api/events';

Meteor.publish('derby.raceBets.recent', function () {
  this.autorun(() =>
    RaceBets.find(
      { event: Events.currentId() },
      { sort: { createdAt: -1 }, limit: 10 },
    ),
  );
});
