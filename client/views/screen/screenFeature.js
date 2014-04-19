Template.screenLeadersTable.helpers({
	leaders: function() {
		return Participants.find({},{sort:{texts_sent:-1},limit:10});
	}
})

Template.screenFeature.helpers({
	aprilClass: function() {
		if(ScreenSettings.findOne('hostessClass'))
			return ScreenSettings.findOne('hostessClass').value;
	},

	featuredLabel: function() {
		if(ScreenSettings.findOne('featuredTextLabel'))
		return ScreenSettings.findOne('featuredTextLabel').value;
	},

	questionText: function() {
		if(ScreenSettings.findOne('questionText'))
			return ScreenSettings.findOne('questionText').value;
	},

	widgetClass: function() {
		if(ScreenSettings.findOne('widgetClass'))
			return ScreenSettings.findOne('widgetClass').value;
	},

	featuredText: function() {
		if(ScreenSettings.findOne('featuredTextGroup')) {		
			var favoriteGroup = Number(ScreenSettings.findOne('featuredTextGroup').value);
			var inText = InTexts.findOne({favorite:favoriteGroup},{sort:{time:-1}});
			return inText;
		}
	}
})