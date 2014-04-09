var checkTime = 5000;
var pixelBuffer = 1000;
var createdTime = new Date();

Template.screenOverlay.rendered = function() {
	if(((new Date()).valueOf()/1000) > (createdTime.valueOf()/1000)+5) {
		$(this.firstNode).parents('.audscreen-shell').addClass('actionText');
		var self = this;
		Meteor.setTimeout(function() {
			$(self.firstNode).fadeOut();
			$(self.firstNode).parents('.audscreen-shell').removeClass('actionText');
		},3000);
	}
};

Template.screenOverlay.helpers({
	actionText: function() {
		var text = ScreenSettings.findOne('actionText');
		if(text) return text.value;
		return "";
	}
});
