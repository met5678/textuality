import { Meteor } from 'meteor/meteor';

import InTexts from './in-texts';

Meteor.methods({
	'inTexts.update': inText => {
		InTexts.update(inText._id, { $set: inText });
	},

	'inTexts.delete': inTextId => {
		if (Array.isArray(inTextId)) {
			InTexts.remove({ _id: { $in: inTextId } });
		} else {
			InTexts.remove(inTextId);
		}
	}
});
