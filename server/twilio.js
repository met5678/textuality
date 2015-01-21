Router.map(function() {
	this.route('textHandler', {
		where: 'server',
		path: '/textHandler',
		action: function() {
			console.log("RECEIVED TEXT");
			console.log(twJson);
			var twJson = this.request.body;
			Meteor.call('inText_receive',twJson);
			this.response.writeHead(200,{'Content-Type':'text/xml'});
			this.response.end('<?xml version="1.0" encoding="UTF-8" ?><Response></Response>');
		}
	});

	this.route('textStatusHandler', {
		where: 'server',
		path: '/textStatusHandler',
		action: function() {
			Meteor.call('outText_updateStatus',this.request.body.SmsSid,this.request.body.SmsStatus);
			this.response.writeHead(200);
		}
	});
});