import { Meteor } from 'meteor/meteor';

import Achievements from './achievements';

Meteor.methods({
	'achievements.new': achievement => {
		const id = Achievements.insert(achievement);
	},

	'achievements.update': achievement => {
		Achievements.update(achievement._id, { $set: achievement });
	},

	'achievements.delete': achievementId => {
		if (Array.isArray(achievementId)) {
			Achievements.remove({ _id: { $in: achievementId } });
		} else {
			Achievements.remove(achievementId);
		}
	}
});
