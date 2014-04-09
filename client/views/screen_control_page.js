Template.screenControlPage.rendered = function() {
	Deps.autorun(function() { 
	var currentModule = ScreenSettings.findOne('ScreenModule');
	if(_.isUndefined(currentModule)) {
	}
	else if(currentModule.value == 'default') {
		$('#screenModuleDefault').prop('checked',true);
	}
	else if(currentModule.value == 'leaderboard') {
		$('#screenModuleLeaderboard').prop('checked',true);
	}
	else if(currentModule.value == 'states') {
		$('#screenModuleStates').prop('checked',true);
	}
	});
};

Template.screenControlPage.events({
	'click .event-reset-btn':function(e) {
		if(confirm("Reset Event: Are you sure?")) {
			Meteor.call('settings_reset_event');
		}
	}
});