/*
InText: The collection storing texts received from users. Special master texts also can end up here.
{
	_id: phoneNumber,
	geo: {
		city:twJson.FromCity,
		state:twJson.FromState,
		zip:twJson.FromZip
	},
	status: 'Active' // or 'Signed off' or 'Banned'
	joined: new Date(), // When joined
	recent: new Date(), // Most recent activity
	alias: 'CurrentAlias',
	old_aliases: ['OldAlias1,OldAlias2'],
	texts_sent_current_alias: 0,
	texts_sent: 0,
	texts_received: 0,
	moderated_texts:0,
	super_user:false, // Are they an admin?
	checkins: [] , // IDs of completed checkpoints
	checkins_complete: false,
	badges: [{
		_id:'random',
		name:'Top Texter',
		icon:'fa-star',
		color:'#s23523'
	}] , // Earned badges
	favorite:false, // Are they a favorite user?
	last_text_long: false,
	receiving_long_text: false,
	note:null,
	random:[Math.random(),0]
	}
*/

Participants = new Meteor.Collection('participants');
if(Meteor.isServer) {
	Participants._ensureIndex({ random : "2d" });
}

var numTextsToBan = 3;
var longTextWaitMillis = 2000;

Meteor.methods({
	participant_getOrAdd: function(twJson) {
		var phoneNumber = twJson.From.substring(1);
		var participant = Participants.findOne(phoneNumber);
		if(!participant) {
			participant = {
				_id: phoneNumber,
				geo: {
					city:twJson.FromCity,
					state:twJson.FromState,
					zip:twJson.FromZip
				},
				status: 'Active',
				joined: new Date(),
				recent: new Date(),
				alias: Meteor.call('alias_getNew'),
				old_aliases: [],
				texts_sent_current_alias: 0,
				texts_sent: 0,
				texts_received: 0,
				moderated_texts:0,
				super_user:false,
				checkins: [],
				checkins_complete: false,
				favorite:false,
				last_text_long: false,
				receiving_long_text: false,
				note:null,
				random:[Math.random(),0]
			};
			Participants.insert(participant);
			Meteor.call('autoText_send',participant,'Welcome');
		}
		return participant;
	},

	participant_incrementModeratedTexts: function(participant) {
		Participants.update(participant, { $inc: { moderated_texts: 1 } });
		if(participant.moderated_texts+1 >= numTextsToBan) {
			participant.status = 'Banned';
			Participants.update(participant._id, {$set : {status:'Banned'}});
			Meteor.call('autoText_send',participant,'Moderation: banned');
			handleExit(participant);
		}
		else {
			Meteor.call('autoText_send',participant,'Moderation: warning',participant.moderated_texts+1);
		}
	},

	participant_setLongText: function(participant,isLongText) {
		Participants.update(participant, {$set: { last_text_long:isLongText } });
	},

	participant_handleLongText: function(participant) {
		Participants.update(participant._id, {$set: { receiving_long_text:true} });
		Meteor.setTimeout(function() {
			Meteor.call('autoText_send',participant,'Moderation: long text');
			Participants.update(participant._id, {$set: { receiving_long_text:false } });
		},longTextWaitMillis);
	},

	participant_incrementSentTexts: function(participant) {
		Participants.update(participant._id,{
			$set: { recent:new Date() },
			$inc: { texts_sent:1, texts_sent_current_alias:1 }
		});
		Meteor.call('autoText_send',participant,'User sent N texts',participant.texts_sent+1);
	},

	participant_incrementReceivedTexts: function(participant) {
		Participants.update(participant._id, {$inc: { texts_received:1 }});
	},

	participant_changeAlias: function(participant) {
		if(participant.texts_sent_current_alias == 0) {
			Meteor.call('alias_release',participant.alias);
		}
		var newAlias = Meteor.call('alias_getNew');
		Participants.update(participant._id,{
			$push: { old_aliases: { $each: [{alias: participant.alias, texts:participant.texts_sent_current_alias}] }},
			$set: { texts_sent_current_alias:0, alias: newAlias }
		});
		participant.alias = newAlias;
		Meteor.call('autoText_send',participant,'Alias change');
	},

	participant_signOff: function(participant) {
		Participants.update(participant._id, {$set: { status:'Signed off' } });
		Meteor.call('autoText_send',participant,'User sign off');
		handleExit(participant);
	},

	participant_signOn: function(participant) {
		Participants.update(participant._id, {$set: { status:'Active' } });		
		Meteor.call('autoText_send',participant,'User resume');
	},

	participant_updateLatestActivity: function(participant) {
		Participants.update(participant._id, {$set: { recent:new Date() } });
	},

	participant_checkin: function(participant,checkpoint) {
		if(!_.contains(participant.checkins,checkpoint._id)) {
			participant.checkins.push(checkpoint._id);
			Participants.update(participant._id,{$push: {checkins: checkpoint._id}});
			if(participant.checkins.length >= Meteor.call('checkpoint_numTotal')) {
				Meteor.call('autoText_send',participant,'Checkins: complete');
				Participants.update(participant._id,{$set: {checkins_complete:true}});
			}
			else {
				Meteor.call('autoText_send_custom',participant,checkpoint.userText);
			}
			return true;
		}
		else {
			Meteor.call('autoText_send',participant,'Checkins: duplicate');
			return false;
		}
	},

	participant_clearAllCheckins:function() {
		Participants.update({},{$set:{checkins:[]}},{multi:true});
	}
});

Participants.find().observeChanges({
	changed:function(id,fields) {
		if(!_.isEmpty(_.omit(fields,'recent')))
			Participants.update(id, {$set: { recent:new Date() } });			
	}
});

if(Meteor.is_server) {
	Meteor.methods({
		participant_getRandomParticipants: function(num,selectedParticipantIDs) {
			var randomParticipants = Participants.find({
				_id: { $nin: selectedParticipantIDs },
				random: { $near: [Math.random(),0] },
				status: 'Active'
				}, { fields: { alias:1 }, limit: num }).fetch();
			return randomParticipants;
		}
	});
}

var handleExit = function(participant) {};