import { Meteor } from 'meteor/meteor';

import AchievementUnlocks from '../';
import Events from 'api/events';

Meteor.publish('achievementUnlocks.latest', function(n) {
  this.autorun(() =>
    AchievementUnlocks.find(
      { event: Events.current()._id },
      {
        sort: { time: -1 },
        limit: n
      }
    )
  );
});
