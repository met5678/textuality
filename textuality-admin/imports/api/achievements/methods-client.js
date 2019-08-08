import { Meteor } from 'meteor/meteor';

import Achievements from './achievements';
import Events from 'api/events';

Meteor.methods({
  'achievements.unlock': ({ trigger, triggerDetail, player }) => {
    const achievementQuery = {
      event: Events.currentId(),
      trigger
    };
    if (triggerDetail) achievementQuery.triggerDetail = triggerDetail;

    const achievement = Achievements.findOne(achievementQuery);
  }
});
