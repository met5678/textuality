import { Meteor } from 'meteor/meteor';

import Events from './events';

Meteor.methods({
	'events.new': event => {
		return Events.insert(event);
	},

	'events.update': event => {
		Events.update(event._id, { $set: event });
	},

	'events.delete': eventId => {
		if (Array.isArray(eventId)) {
			Events.remove({ _id: { $in: eventId } });
		} else {
			Events.remove(eventId);
		}
	},

	'events.activate': (eventId, deactivate) => {
		console.log('Updating eventId', eventId, deactivate);
		if (!eventId || deactivate) {
			Events.update({}, { $set: { active: false } }, { multi: true });
		} else {
			Events.update(
				{ _id: { $ne: eventId } },
				{ $set: { active: false } },
				{ multi: true }
			);
			Events.update(eventId, { $set: { active: true } });
		}
	}
});
