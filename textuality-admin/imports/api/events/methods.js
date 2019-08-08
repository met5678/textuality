import { Meteor } from 'meteor/meteor';

import Events from './events';

Meteor.methods({
	'events.new': event => {
		if (event.active) Meteor.call('events.activate', null, true);
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
	},

	'events.reset': eventId => {
		Meteor.call('inTexts.resetEvent', eventId);
		Meteor.call('outTexts.resetEvent', eventId);
		Meteor.call('aliases.resetEvent', eventId);
		Meteor.call('players.resetEvent', eventId);
		Meteor.call('media.resetEvent', eventId);
		Meteor.call('achievementUnlocks.resetEvent', eventId);
	}
});
