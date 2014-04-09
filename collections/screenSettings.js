ScreenSettings = new Meteor.Collection('screenSettings');

Meteor.methods({
	settings_ticker_update: function(tickerText) {
		ScreenSettings.upsert('tickerText',{$set:{value:tickerText}});
	},

	settings_action_update: function(actionText) {
		ScreenSettings.upsert('actionText',{$set:{value:actionText}});
	},

	settings_infobar_update: function(infoBarText) {
		ScreenSettings.upsert('infoBarText',{$set:{value:infoBarText}});
	},

	settings_reset_event: function() {
		ScreenSettings.remove({});
		InTexts.remove({});
		OutTexts.remove({});
		Participants.remove({});
		Meteor.call('checkpoint_clearCheckins');
		Meteor.call('alias_resetall');
	}
});