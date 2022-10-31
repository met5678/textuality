import { Meteor } from 'meteor/meteor';

import AchievementUnlocks from '../';
import Events from 'api/events';

Meteor.publish('achievementUnlocks.all', function() {
  this.autorun(() => AchievementUnlocks.find({ event: Events.current()._id }));
});
