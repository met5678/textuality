import { Meteor } from 'meteor/meteor';

import AchievementUnlocks from './achievementUnlocks';
import Events from 'api/events';

Meteor.methods({
	'achievementUnlocks.update': achievementUnlock => {
		AchievementUnlocks.update(achievementUnlock._id, {
			$set: achievementUnlock
		});
	},

	'achievementUnlocks.delete': achievementUnlockId => {
		if (Array.isArray(achievementUnlockId)) {
			AchievementUnlocks.remove({ _id: { $in: achievementUnlockId } });
		} else {
			AchievementUnlocks.remove(achievementUnlockId);
		}
	},

	'achievementUnlocks.resetEvent': () => {
		AchievementUnlocks.remove({ event: Events.currentId() });
	}
});
