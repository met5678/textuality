import { Meteor } from 'meteor/meteor';

import Aliases from './aliases';
import Events from 'api/events';

Meteor.methods({
	'aliases.new': name => {
		if (!Aliases.findOne({ name, event: Events.currentId() })) {
			const alias = {
				name,
				used: false,
				event: Events.currentId()
			};
			return Aliases.insert(alias);
		} else {
			throw new Meteor.Error(
				'alias-already-exists',
				'This alias already exists'
			);
		}
	},

	'aliases.update': alias => {
		Aliases.update(alias._id, { $set: alias });
	},

	'aliases.delete': aliasId => {
		if (Array.isArray(aliasId)) {
			Aliases.remove({ _id: { $in: aliasId } });
		} else {
			Aliases.remove(aliasId);
		}
	},

	'aliases.resetEvent': () => {
		Aliases.update(
			{ event: Events.currentId() },
			{ $set: { used: false } },
			{ multi: true }
		);
	},

	'aliases.clearAll': () => {
		Aliases.remove({ event: Events.currentId() });
	}
});
