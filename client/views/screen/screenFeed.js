Template.screenFeed.helpers({
	feedTexts: function() {
		return InTexts.find( { 'purpose.type':'feed' }, {sort: {time:-1}, limit:20});
	}
});

Template.screenFeedItem.helpers({
	textClass: function() {
		if(this.participant == 'master') {
			return 'masterText';
		}
		return '';
	},

	checkinPercent: function() {
		var numTotal = Checkpoints.find().count();
		if(_.isNumber(this.checkins) && numTotal >= 0) {
			return (this.checkins / numTotal)*100;
		}
		return 0;
	},

	checkinMeterSize: function() {
		return Checkpoints.find().count()*11+2;
	},

	timeUtc: function() {
		return Math.floor(this.time.valueOf()/1000);
	},

	bodyFormatted: function() {
		//var highlightRegex = /\b#\w\w+/;
		return this.body;
	},

	isMaster: function() {
		return this.participant == 'master';
	}
});

var config = {
	numTexts: 20
};

var curYOffset = 0;

Template.screenFeedItem.rendered = function() {
	var textsFeed = $('.tscreen-texts-feed');

	var numTexts = textsFeed.children().length;
	for(var a=25; a<numTexts; a++)
		textsFeed.children().last().remove();

	var newTextEl = $(this.firstNode);
	newTextEl.show();
	newTextEl.css('opacity',0);
	newTextEl[0].offsetHeight;

	textsFeed.addClass('notransition');
	var textElHeight = newTextEl.outerHeight(true);
	curYOffset += textElHeight/2;
	textsFeed.css({
		'-webkit-transform':'translate3d(0,'+(-1*textElHeight)+'px,0)',
		'-moz-transform':'translateY(0,'+(-1*textElHeight)+'px,0)',
		'transform':'translateY(0,'+(-1*textElHeight)+'px,0)'
	});
	newTextEl[0].offsetHeight;
	textsFeed[0].offsetHeight;
	
	newTextEl.removeClass('notransition');
	newTextEl.css('opacity',1);
	textsFeed.removeClass('notransition');
	textsFeed.css({
			'-webkit-transform':'translateY(0,0,0)',
			'-moz-transform':'translateY(0,0,0)',
			'transform':'translateY(0,0,0)'
	});
};