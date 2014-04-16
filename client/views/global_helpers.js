Handlebars.registerHelper("timeRelative", function(date,raw) {
	if(date) {
		var utcSecs = Math.floor(date.valueOf()/1000);
		var seconds = Math.floor((new Date()).valueOf()/1000) - utcSecs;
		var displayVal = '';
		if(seconds < 5) {
			displayVal = 'Now';
		}
		if(seconds < 60) {
			displayVal = (Math.round(seconds/5)*5) + 's';
		}
		else {
			displayVal = (Math.floor(seconds/60)) + "m";
		}
		if(raw) {
			return displayVal;
		}
		else {
			return new Handlebars.SafeString('<span class="rel-time" data-utc="'+utcSecs+'">'+displayVal+'</span>');
		}
	}
	else {
		return 'no date';
	}
});

Handlebars.registerHelper("timeAbsolute", function(date) {
	if(date) {
		return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	}
	else {
		return 'no date';
	}
});