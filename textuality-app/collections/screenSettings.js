/*
{
	key:
	description:
	dataType:
	value:
	min:
	max:
	options:
}
*/

ScreenSettings = new Meteor.Collection('screenSettings');
ScreenSettings.allow({
	update: function(userId, doc) {
		return Roles.userIsInRole(userId,'admin');
	}
});

Meteor.methods({
	settings_reset_event: function() {
		ScreenSettings.remove({});
		InTexts.remove({});
		OutTexts.remove({});
		Participants.remove({});
		Meteor.call('checkpoint_clearCheckins');
		Meteor.call('alias_resetall');
	},

	settings_super_update: function(setting,value) {
		ScreenSettings.update(setting,{
			$set: {'value':value}
		});
	}
});