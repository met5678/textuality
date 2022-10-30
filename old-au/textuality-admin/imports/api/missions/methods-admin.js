import { Meteor } from 'meteor/meteor';

import Missions from './missions';
import Events from 'api/events';
import Players from 'api/players';

Meteor.methods({
	'missions.new': mission => {
		const id = Missions.insert(mission);
	},

	'missions.update': mission => {
		Missions.update(mission._id, { $set: mission });
	},

	'missions.delete': missionId => {
		if (Array.isArray(missionId)) {
			Missions.remove({ _id: { $in: missionId } });
		} else {
			Missions.remove(missionId);
		}
	},

	'missions.resetEvent': () => {
		Missions.update(
			{ event: Events.currentId() },
			{
				$set: { active: false },
				$unset: { timePreText: '', timeStart: '', timeEnd: '' }
			},
			{ multi: true }
		);
	}
});
