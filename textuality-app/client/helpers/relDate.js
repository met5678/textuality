Meteor.setInterval(function() {
	$('.rel-time').each(function(i,el) {
		var jqEl = $(el);
		var utcSecs = jqEl.attr('data-utc');
		var seconds = Math.floor((new Date()).valueOf()/1000) - utcSecs;
		if(seconds < 5) {
			jqEl.html('Just now');
		}
		else if(seconds < 60) {
			jqEl.html((Math.round(seconds/5)*5) + 's ago');
		}
		else {
			jqEl.html((Math.floor(seconds/60)) + 'm ago');
		}
	});
	$('.rel-time-data').each(function(i,el) {
		var jqEl = $(el);
		var utcSecs = jqEl.attr('data-utc');
		var seconds = Math.floor((new Date()).valueOf()/1000) - utcSecs;
		if(seconds < 5) {
			jqEl.attr('data-reltime','Just now');
		}
		else if(seconds < 60) {
			jqEl.attr('data-reltime',(Math.round(seconds/5)*5) + 's ago');
		}
		else {
			jqEl.attr('data-reltime',(Math.floor(seconds/60)) + 'm ago');
		}
		
	});
},5000);
	