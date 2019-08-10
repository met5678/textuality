import { Meteor } from 'meteor/meteor';

import MissionPairings from './missionPairings';
import Events from 'api/events';

Meteor.methods({
	'missionPairings.update': missionPairing => {
		MissionPairings.update(missionPairing._id, {
			$set: missionPairing
		});
	},

	'missionPairings.delete': missionPairingId => {
		if (Array.isArray(missionPairingId)) {
			MissionPairings.remove({ _id: { $in: missionPairingId } });
		} else {
			MissionPairings.remove(missionPairingId);
		}
	},

	'missionPairings.resetEvent': () => {
		MissionPairings.remove({ event: Events.currentId() });
	}
});
