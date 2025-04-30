import { Meteor } from 'meteor/meteor';

import AchievementUnlocks from '..';
import Events from '/imports/api/events';

Meteor.publish('achievementUnlocks.latest', function (n: number) {
  this.autorun(() =>
    AchievementUnlocks.find(
      { event: Events.currentId() },
      {
        sort: { time: -1 },
        limit: n,
      },
    ),
  );
});
