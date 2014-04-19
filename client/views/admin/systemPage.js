Template.adminSystem.events({
	'click .event-reset-btn':function(e) {
		if(confirm("Reset Event: Are you sure?")) {
			Meteor.call('settings_reset_event');
		}
	}
});