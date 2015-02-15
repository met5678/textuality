Template.screenMain.helpers({
	actionText:function() {
		if(ScreenSettings.findOne('actionText'))
			return ScreenSettings.findOne('actionText').value;
	},

	backgroundImage:function() {
		var text = InTexts.findOne({
			"purpose.type": {$in:['feed','imageFeed']},
			"image": {$exists: true}
		}, {
			"sort": {time:-1}
		});

		if(!!text) {
			return text.image.url;
		}
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

	InTexts.find({
		"purpose.type": {$in:['feed','imageFeed']},
		"image": {$exists: true}
	}).observe({
		"added": function() {
			$('.tscreen-background-image').addClass('active');
			Meteor.setTimeout(function() {
				$('.tscreen-background-image').removeClass('active');
			}, 10000);
		}
	})
};
