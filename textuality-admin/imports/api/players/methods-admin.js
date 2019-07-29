import { Meteor } from 'meteor/meteor';

import Players from './players';

Meteor.methods({
	'players.update': player => {
		Players.update(player._id, { $set: player });
	},

	'players.delete': playerId => {
		if (Array.isArray(playerId)) {
			Players.remove({ _id: { $in: playerId } });
		} else {
			Players.remove(playerId);
		}
	}
});
