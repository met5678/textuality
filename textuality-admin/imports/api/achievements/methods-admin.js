import { Meteor } from 'meteor/meteor';

import Achievements from './achievements';

Meteor.methods({
	'achievements.new': achievement => {
		if (achievement.trigger.startsWith('N_'))
			achievement.triggerDetail = Number(achievement.triggerDetail);
		const id = Achievements.insert(achievement);
	},

	'achievements.update': achievement => {
		if (achievement.trigger.startsWith('N_'))
			achievement.triggerDetail = Number(achievement.triggerDetail);
		Achievements.update(achievement._id, { $set: achievement });
	},

	'achievements.delete': achievementId => {
		if (Array.isArray(achievementId)) {
			Achievements.remove({ _id: { $in: achievementId } });
		} else {
			Achievements.remove(achievementId);
		}
	},

	'achievements.resetEvent': () => {
		Achievements.update(
			{ event: Events.currentId() },
			{ $set: { earned: 0 } },
			{ multi: true }
		);
	}
});
