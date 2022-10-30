import { Meteor } from 'meteor/meteor';

import AutoTexts from './autoTexts';

Meteor.methods({
	'autoTexts.new': autoText => {
		const id = AutoTexts.insert(autoText);
	},

	'autoTexts.update': autoText => {
		AutoTexts.update(autoText._id, { $set: autoText });
	},

	'autoTexts.delete': autoTextId => {
		if (Array.isArray(autoTextId)) {
			AutoTexts.remove({ _id: { $in: autoTextId } });
		} else {
			AutoTexts.remove(autoTextId);
		}
	}
});
