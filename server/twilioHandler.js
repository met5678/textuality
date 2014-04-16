Router.map(function() {
	this.route('textHandler', {
		where: 'server',
		path: '/textHandler',
		action: function() {
			var twJson = this.request.body;
			//Meteor.call('inText_receive',twJson);
			console.log(twJson);
			this.response.writeHead(200,{'Content-Type':'text/xml'});
			this.response.end('<?xml version="1.0" encoding="UTF-8" ?><Response></Response>');
		}
	});
});


/*Meteor.Router.add('/textHandler','POST', function() {
	var twJson = this.request.body;
	Meteor.call('inText_receive',twJson);
	return [200,{'Content-Type':'text/xml'},'<?xml version="1.0" encoding="UTF-8" ?><Response></Response>'];
});

Meteor.Router.add('/textStatusHandler','POST', function() {
	Meteor.call('outText_updateStatus',this.request.body.SmsSid,this.request.body.SmsStatus);
	return 200;
});*/