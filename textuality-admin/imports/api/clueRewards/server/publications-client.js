import { Meteor } from 'meteor/meteor';

import ClueRewards from '../';
import Events from 'api/events';

Meteor.publish('clueRewards.latest', function (n) {
  this.autorun(() =>
    ClueRewards.find(
      { event: Events.current()._id },
      {
        sort: { time: -1 },
        limit: n,
      }
    )
  );
});
