import { Meteor } from 'meteor/meteor';

import Events from 'api/events';
import OutTexts from './outTexts';

Meteor.methods({
	'outTexts.update': outText => {
		OutTexts.update(outText._id, { $set: outText });
	},

	'outTexts.delete': outTextId => {
		if (Array.isArray(outTextId)) {
			OutTexts.remove({ _id: { $in: outTextId } });
		} else {
			OutTexts.remove(outTextId);
		}
	},

	'outTexts.resetEvent': () => {
		OutTexts.remove({ event: Events.currentId() });
	}
});
