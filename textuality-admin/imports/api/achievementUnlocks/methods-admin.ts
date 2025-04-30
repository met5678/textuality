import { Meteor } from 'meteor/meteor';

import AchievementUnlocks, {
  AchievementUnlockWithHelpers,
} from './achievementUnlocks';
import Events from '/imports/api/events';
import { AchievementUnlockId } from '/imports/schemas/achievementUnlock';

Meteor.methods({
  'achievementUnlocks.update': (
    achievementUnlock: AchievementUnlockWithHelpers,
  ) => {
    AchievementUnlocks.update(achievementUnlock._id, {
      $set: achievementUnlock,
    });
  },

  'achievementUnlocks.delete': (
    achievementUnlockId: AchievementUnlockId | AchievementUnlockId[],
  ) => {
    if (Array.isArray(achievementUnlockId)) {
      AchievementUnlocks.remove({ _id: { $in: achievementUnlockId } });
    } else {
      AchievementUnlocks.remove(achievementUnlockId);
    }
  },

  'achievementUnlocks.resetEvent': () => {
    AchievementUnlocks.remove({ event: Events.currentId() });
  },
});
