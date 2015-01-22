/*
Incoming texts look like:
{
  From: '+12024948427',
  FromCity: 'WASHINGTON',
  FromState: 'DC',
  FromZip: '20009',
  FromCountry: 'US',

  To: '+15719894785',
  ToCity: 'WASHINGTON',
 	ToState: 'VA', 
  ToZip: '20053',
	ToCountry: 'US',

  Body: '',

  NumMedia: '1',
 	MediaContentType0: 'image/jpeg',
  MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/AC482cf8d12c4fc97ee1d092472e25f436/Messages/MM41d53102cf43d67ba51841e876d59933/Media/ME6c689c62ff2971d2cee30623f30e89c5',

  SmsStatus: 'received',

  SmsSid: 'MM41d53102cf43d67ba51841e876d59933',
  MessageSid: 'MM41d53102cf43d67ba51841e876d59933',
  AccountSid: 'AC482cf8d12c4fc97ee1d092472e25f436',
 	SmsMessageSid: 'MM41d53102cf43d67ba51841e876d59933',
  ApiVersion: '2010-04-01'
}
*/

var twilioAccountSid = 'AC482cf8d12c4fc97ee1d092472e25f436';
var twilioToken = '35a791687ad9c69dabef87884b8897d5';
var twilioSendUrl = 'https://api.twilio.com/2010-04-01/Accounts/'+twilioAccountSid+'/SMS/Messages.json';
var twilioNumber = '+15719894785';
var twilioStatusUrl = 'http://www.textualityparty.com/textStatusHandler';

var twilio = Twilio(twilioAccountSid,twilioToken);

Router.route('/textHandler', { where: 'server' })
	.post(function() {
			var twJson = this.request.body;
			Meteor.call('inText_receive',twJson);
			this.response.writeHead(200,{'Content-Type':'text/xml'});
			this.response.end('<?xml version="1.0" encoding="UTF-8" ?><Response></Response>');
	});

Router.route('/textStatusHandler', { where: 'server' })
	.post(function() {
		Meteor.call('outText_updateStatus',this.request.body.SmsSid,this.request.body.SmsStatus);
		this.response.writeHead(200);
	});

var sendMessage = function(message,cb) {
	message.body = message.body.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
	message.from = twilioNumber;

	twilio.sendSms(message,cb);
};

Textuality.sendMessage = Meteor.wrapAsync(sendMessage);
