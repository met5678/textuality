Template.screenMain.helpers({
	actionText:function() {
		if(ScreenSettings.findOne('actionText'))
			return ScreenSettings.findOne('actionText').value;
	}
});

Template.screenMain.rendered = function() {
	ScreenSettings.find('actionText').observeChanges({
		changed: function() {
			$('.tscreen-shell').addClass('actionText');
			var self = this;
			Meteor.setTimeout(function() {
				$(self.firstNode).fadeOut();
				$('.tscreen-shell').removeClass('actionText');
			},3600);
		}
	});
};
