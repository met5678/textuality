OutTexts = new Meteor.Collection('outTexts');

if(Meteor.isServer) {

Meteor.methods({
	outText_send: function(outText,participants,purpose) {
		outText.participants = [];
		outText.time = new Date();
		if(!!purpose) {
			outText.purpose = 'manual';
		}
		if(_.isArray(participants)) {
			_.each(participants, function(participantId) {
				var participant = Participants.findOne(participantId);
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
			var participant = Participants.findOne(participants);
			console.log(participants,participant);
			outText.participants.push({
				participant_id:participant._id,
				participant_alias:participant.alias,
				status:'unsent',
				time:new Date(),
				sid:null
			});
		}
		outText._id = OutTexts.insert(outText);
		_.each(outText.participants, function(participant) {
			var phoneNumber = participant.participant_id;
			Meteor.call('participant_incrementReceivedTexts',participant);

			Twilio.sendMessage(phoneNumber,outText.body, function (err,result) {
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