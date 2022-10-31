import { Meteor } from 'meteor/meteor';

import Checkpoints from './checkpoints';
import Events from 'api/events';

Meteor.methods({
	'checkpoints.new': checkpoint => {
		if (
			Checkpoints.findOne({
				event: checkpoint.event,
				hashtag: checkpoint.hashtag
			})
		) {
			throw new Meteor.Error(
				'hashtag-in-use',
				'Hashtag in use by another checkpoint'
			);
		}
		return Checkpoints.insert(checkpoint);
	},

	'checkpoints.update': checkpoint => {
		if (
			Checkpoints.findOne({
				_id: { $ne: checkpoint._id },
				event: checkpoint.event,
				hashtag: checkpoint.hashtag
			})
		) {
			throw new Meteor.Error(
				'hashtag-in-use',
				'Hashtag in use by another checkpoint'
			);
		}
		Checkpoints.update(checkpoint._id, { $set: checkpoint });
	},

	'checkpoints.delete': checkpointId => {
		if (Array.isArray(checkpointId)) {
			Checkpoints.remove({ _id: { $in: checkpointId } });
		} else {
			Checkpoints.remove(checkpointId);
		}
	}
});
