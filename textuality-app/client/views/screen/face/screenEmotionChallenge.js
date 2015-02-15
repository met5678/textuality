Template.screenEmotionChallenge.helpers({
	emotion: function() {
		return ScreenSettings.findOne('whichEmotion').value;
	},

	featuredLabel: function() {
		return ScreenSettings.findOne('featuredTextLabel').value
	},

	leadSelfies: function() {
		var emotion = ScreenSettings.findOne('whichEmotion').value;

		return InTexts.find({
			"purpose.type": "emotion",
			"purpose.emotion": emotion,
			"purpose.score": { $gte: .50 }
		},{
			sort: {"purpose.score": -1},
			limit: 2
		});
	},

	allSelfies: function() {
		var emotion = ScreenSettings.findOne('whichEmotion').value;

		return InTexts.find({
			"purpose.type": "emotion",
			"purpose.emotion": emotion,
			"purpose.score": { $gte: 0.01 }
		},{
			sort: {"time": -1},
			limit: 2
		});		
	}
});

Template.screenEmotionImage.helpers({
	url: function() {
		return this.image.transforms.emotion;
	},

	score: function() {
		return this.purpose.score*100;
	}
})