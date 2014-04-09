Template.footer.helpers({
	isAudienceScreen: function() {
		return Meteor.Router.page() == 'audienceScreen';
	}
});