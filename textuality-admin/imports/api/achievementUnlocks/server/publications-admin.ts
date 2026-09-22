import { Meteor } from 'meteor/meteor';

import AchievementUnlocks from '..';
import Events from '/imports/api/events';
import getPaginatedCursor from '/imports/api/_utils/publish-paginated';

Meteor.publish('achievementUnlocks.all', function () {
  this.autorun(() => AchievementUnlocks.find({ event: Events.currentId() }));
});

Meteor.publish(
  'achievementUnlocks.paged',
  getPaginatedCursor(AchievementUnlocks, {
    getServerQuery: () => ({
      event: Events.currentId(),
    }),
  }),
);
