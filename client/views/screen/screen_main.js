Template.screenFeed.helpers({
	feedTexts: function() {
		return InTexts.find( { 'purpose.type':'feed' }, {sort: {time:-1}, limit:20});
	}
});

Template.screenFeedItem.helpers({
	textClass: function() {
		if(this.alias == 'Primitilda') {
			return 'primitilda';
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
	}
});

var config = {
	numTexts: 25
};

var curYOffset = 0;

Template.screenFeedItem.rendered = function() {
	var shell = $('.audscreen-shell');
	var textsFeed = $('.texts-feed');
	var textEls = $('.texts-feed-item');
	var drawingsEl = $('.cave-drawings');

	var numTexts = textsFeed.children().length;
	for(var a=25; a<numTexts; a++)
		textsFeed.children().last().remove();

	var newTextEl = $(this.firstNode);
	newTextEl[0].offsetHeight;
	
	textsFeed.addClass('notransition');
	newTextEl.removeClass('notransition');
	var textElHeight = newTextEl.outerHeight(true);
	curYOffset += textElHeight/2;
	textsFeed.css('top',(-1*textElHeight)+'px');
	newTextEl[0].offsetHeight;
	textsFeed[0].offsetHeight;
	
	newTextEl.css('opacity',1);
	textsFeed.removeClass('notransition');
	textsFeed.css('top',0);
	shell.css('background-position','0 '+curYOffset+'px');
	var curDrawingsOffset = drawingsEl.offset().top;
	if(curYOffset < 8000) {
		drawingsEl.css({
			'-webkit-transform':'translateY('+curYOffset+'px)',
			'-moz-transform':'translateY('+curYOffset+'px)',
			'transform':'translateY('+curYOffset+'px)',
		});
	}
	else {
		drawingsEl.css({
			'-webkit-transform':'translateY(0px)',
			'-moz-transform':'translateY(0px)',
			'transform':'translateY(0px)',
		});
	}
	textsFeed[0].offsetHeight;
}

//Template.screenMainArea.preserve(['.screen-module-default','.screen-module-leaderboard']);