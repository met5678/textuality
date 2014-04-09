Template.screenInfo.helpers({
	infoText: function() {
		var text = ScreenSettings.findOne('infoBarText');
		if(text) return text.value;
		return "";
	}
});

Template.screenTicker.helpers({
	tickerText: function() {
		var text = ScreenSettings.findOne('tickerText');
		if(text) return text.value;
		return "";
	}
});

Template.screenInfo.rendered = function() {
	var textEl = $(this.firstNode);
	textEl[0].offsetHeight;
	textEl.addClass('showing');
};

Template.screenTicker.rendered = function() {
	var textEl = $(this.firstNode);
	textEl[0].offsetHeight;
	textEl.addClass('showing');
};