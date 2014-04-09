Template.header.helpers({
	isAudienceScreen: function() {
		return Meteor.Router.page() == 'audienceScreen';
	},

	isPage: function(pageName) {
		if(pageName == Meteor.Router.page()) {
			return 'active';
		}
		return '';
	}
});