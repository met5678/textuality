OutTexts = new Meteor.Collection('outTexts');

if(Meteor.isServer) {

var twilioAccountSid = 'AC482cf8d12c4fc97ee1d092472e25f436';
var twilioToken = '35a791687ad9c69dabef87884b8897d5';
var twilioSendUrl = 'https://api.twilio.com/2010-04-01/Accounts/'+twilioAccountSid+'/SMS/Messages.json';
var twilioNumber = '+15719894785';
var twilioStatusUrl = 'http://textualityparty.com/textStatusHandler';

Meteor.methods({
	outText_send: function(outText,participants) {
		outText.participants = [];
		outText.time = new Date();
		if(_.isArray(participants)) {
			_.each(participants, function(participant) {
				outText.participants.push({
					participant_id:participant._id,
					participant_alias:participant.alias,
					status:'unsent',
					time:new Date(),
					sid:null
				});
			});
		}
		else {
			outText.participants.push({
				participant_id:participants._id,
				participant_alias:participants.alias,
				status:'unsent',
				time:new Date(),
				sid:null
			});
		}
		outText._id = OutTexts.insert(outText);
		_.each(outText.participants, function(participant) {
			var phoneNumber = participant.participant_id;
			Meteor.call('participant_incrementReceivedTexts',participant);
			var cleanBody = outText.body.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
			console.log("Clean body:{"+cleanBody+"}");
			Meteor.http.post(twilioSendUrl,{
				params:{From:twilioNumber, To:'+'+phoneNumber, Body: cleanBody, StatusCallback:twilioStatusUrl},
				auth: twilioAccountSid+':'+twilioToken,
				headers: {'content-type':'application/x-www-form-urlencoded'}
			}, function (err,result) {
				OutTexts.update({_id:outText._id, 'participants.participant_id':phoneNumber},
						{ $set: { 'participants.$.status': result.data.status, 'participants.$.sid':result.data.sid } });
			});
		});
	},

	outText_updateStatus: function(sid,status) {
		OutTexts.update({'participants.sid':sid},
			{ $set: { 'participants.$.status': status,
				    'participants.$.time': new Date() } });
		
	}
});

}