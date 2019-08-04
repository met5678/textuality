import { Meteor } from 'meteor/meteor';

import Events from 'api/events';
import OutTexts from './outTexts';

Meteor.methods({
	'outTexts.update': inText => {
		InTexts.update(inText._id, { $set: inText });
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
