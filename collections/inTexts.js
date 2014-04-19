/*
InText: The collection storing texts received from users. Special master texts also can end up here.
{
	body
	participant: [Participant ID]
	alias: [String: Alias]
	checkins: [Number]
	moderation:
	purpose:
	favorite: [Boolean]
	time: [Timestamp]
}
*/

InTexts = new Meteor.Collection('inTexts');
InTexts.allow({
	update: function(userId, doc) {
		return Roles.userIsInRole(userId,'admin');
	}
});

var moderationCutoff = 8;
var textsToBan = 3;
var longTextCharacters = 140;
var longTextMillis = 1000;

Meteor.methods({
	inText_receive: function(twJson) {
		// Doing this first to get the timestamp sequence correct
		var recTime = new Date();

		var participant = Meteor.call('participant_getOrAdd',twJson);
	
		var inText = {
			body:twJson.Body,
			participant:participant._id,
			alias:participant.alias,
			checkins:participant.checkins.length,
			badges:participant.badges,
			moderation:null,
			purpose:null,
			favorite:0,
			time:recTime
		};

		// Handle long text

		processModeration(inText,participant);

		if(inText.moderation.passed) {
			inText.purpose = {};
			if(checkSystemText(inText,participant)) {
				Meteor.call('participant_updateLatestActivity',participant);
			}
			else if(checkCheckpointText(inText,participant)) {
				inText.purpose.type = 'checkin';
				Meteor.call('participant_updateLatestActivity',participant);
			}
			else {
				inText.purpose.type = 'feed';
				Meteor.call('participant_incrementSentTexts',participant);
			}

			if(participant.status == 'Signed off') {
				Meteor.call('participant_signOn',participant);
			}
		}
		else {
			Meteor.call('participant_updateLatestActivity',participant);
		}

		InTexts.insert(inText);
		Meteor.call('autoText_send',participant,'AUTO_TOTAL_N_TEXTS',InTexts.find({'purpose.type':'feed'}).count());
	},

	inText_sendMasterText: function(body) {
		var inText = {
			body: body,
			participant:'master',
			alias:'AprilShowers',
			moderation: {
				passed:true,
				status:'OK',
				score:0
			},
			purpose: {
				type:'feed'
			},
			favorite: false,
			time:new Date()
		};

		InTexts.insert(inText);
	},

	inText_clearFavorites: function(favoriteNum) {
		InTexts.update({'favorite':favoriteNum},{$set:{favorite:0}},{multi:true});
	}
});

var processModeration = function(inText,participant) {
	var score = 0;
	var text = inText.body.toLowerCase();
	score += 10 * (text.match(/(n+i+g+g+e+r)|(f+a+g)/g) || []).length;
	score += 4 * (text.match(/(c+u+n+t)|(s+l+u+t)|(t+w+i+n+k)|(w+h+o+r+e)|(p+u+s+s+y)|(r+e+t+a+r+d)|(c+o+c+k)|(d+y+k+e)/g) || []).length;
	score += 2 * (text.match(/(f+u+c+k)|(b+i+t+c+h)|(d+i+c+k)|(t+i+t+s)/g) || []).length;
	
	inText.moderation = inText.moderation || {};
	inText.moderation.score = score;
	
	if(participant.status == 'Banned') {
		inText.moderation.passed = false;
		inText.moderation.status = 'Banned user';
		return;
	}

	if(participant.last_text_long && ((new Date()).valueOf() - participant.recent.valueOf()) <= longTextMillis) {
		inText.moderation.passed = false;
		inText.moderation.status = 'Long text';
		if(!participant.receiving_long_text) {
			Meteor.call('participant_handleLongText',participant);
		}
		return;
	}

	// Process text length
	Meteor.call('participant_setLongText',participant,(inText.body.length >= longTextCharacters));

	
	if(score >= moderationCutoff) {
		inText.moderation.passed = false;
		inText.moderation.status = 'Stopped';
		Meteor.call('participant_incrementModeratedTexts',participant);
		return;
	}

	inText.moderation.passed = true;
	inText.moderation.status = 'OK';
};

var checkSystemText = function(inText,participant) {
	if(inText.body.indexOf('#goodbye') != -1) {
		inText.purpose = {
			type:'system',
			description:'User signoff'
		};
		Meteor.call('participant_signOff',participant);
		return true;
	}
	else if(inText.body.toLowerCase().indexOf('#change') != -1) {
		inText.purpose = {
			type:'system',
			description:'Alias change'
		};
		Meteor.call('participant_changeAlias',participant);
		return true;
	}
	else if(participant.status == 'Signed off' && inText.body.indexOf('#comeback') != -1) {
		inText.purpose = {
			type:'system',
			description:'User resume'
		};
		Meteor.call('participant_signOn',participant);
		return true;
	}
	return false;
};

var checkCheckpointText = function(inText,participant) {
	if(inText.body.indexOf('#') != -1) {
		return Meteor.call('checkpoint_checkText',participant,inText);
	}
	return false;
};

var checkSuperText = function(inText,participant) {
	if(participant.super_user) {
		if(inText.body.toLowerCase().indexOf('#tilda') == 0 && inText.body.length > 6) {
			Meteor.call('inText_sendMasterText',inText.body.substring(6));
			return true;
		}
		else if(inText.body.toLowerCase().indexOf('#action') == 0 && inText.body.length > 7) {
			Meteor.call('settings_action_update',inText.body.substring(7));
			return true;
		}
		else if(inText.body.toLowerCase().indexOf('#infobar') == 0 && inText.body.length > 8) {
			Meteor.call('settings_infobar_update',inText.body.substring(8));
			return true;
		}
	}
	return false;
};