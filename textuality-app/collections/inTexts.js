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
		var recTime = new Date();

		var participant = Meteor.call('participant_getOrAdd',twJson);

		var inText = {
			body:twJson.Body,
			participant:participant._id,
			alias:participant.alias,
			avatar:participant.avatar,
			checkins:participant.checkins.length,
			badges:participant.badges,
			moderation:null,
			purpose:null,
			favorite:0,
			time:recTime
		};

		if(parseInt(twJson.NumMedia) > 0) {
			handleImage(twJson,inText);
		}

		// Doing this first to get the timestamp sequence correct

		// Handle long text

		processModeration(inText,participant);

		if(inText.moderation.passed) {
			inText.purpose = {};
			if(checkSystemText(inText,participant)) {
				Meteor.call('participant_updateLatestActivity',participant);
			}
			else if(checkSuperText(inText,participant)) {
				inText.purpose.type = 'super';
			}
			else if(checkCheckpointText(inText,participant)) {
				inText.purpose.type = 'checkin';
				Meteor.call('participant_updateLatestActivity',participant);
			}
			else if(checkActivityText(inText,participant)) {
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
			alias:'Mother Tilda',
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
	else if(inText.body.toLowerCase().indexOf('#avatar') != -1) {
		inText.purpose = {
			type:'system',
			description:'Avatar change'
		};
		if(!!inText.image) {
			Meteor.call('participant_changeAvatar',participant,inText.image);
			inText.avatar = participant.avatar;
		}
		else {
			Meteor.call('autoText_send',participant,'AUTO_AVATAR_NO_IMAGE');
		}
		return true;
	}
	else if(participant.status == 'Signed off') {
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
			Meteor.call('settings_super_update','actionText',inText.body.substring(7));
			return true;
		}
		else if(inText.body.toLowerCase().indexOf('#infobar') == 0 && inText.body.length > 8) {
			Meteor.call('settings_infobar_update',inText.body.substring(8));
			return true;
		}
	}
	return false;
};

var isGoodSelfie = function(face) {
	return face.boundingbox.size.width >= 300 &&
		face.boundingbox.size.height >= 300 &&
		Math.abs(face.pose.roll) < 30 &&
		Math.abs(face.pose.yaw) < 40 &&
		Math.abs(face.pose.pitch) < 30;
};

var doFaceCrops = function(inText,participant) {
	var face = inText.image.face;
	var overflowFrac = .8;
	var overflowFracMouth = .4;

	var mouthW = face.mouth_r.x - face.mouth_l.x;
	var mouthH = face.m_d.y - face.m_u.y;

	var mouthTransform = {
		radius: (mouthW/2) | 0,
		background: "#3e2c2c",
		width: (mouthW * (1+overflowFracMouth)) | 0,
		height: (mouthH * (1+overflowFracMouth)) | 0,
		x: (face.mouth_l.x - mouthW*overflowFracMouth*.5) | 0,
		y: (face.m_u.y - mouthH*overflowFracMouth*.5) | 0,
		crop: "crop",
		gravity: "custom",
		effect: "contrast:50"
	};

	var lEyeW = face.e_lr.x - face.e_ll.x;
	var lEyeH = face.e_ld.y - face.e_lu.y;

	var lEyeTransform = {
		radius: (lEyeW/2) | 0,
		background: "#0e0412",
		width: (lEyeW * (1+overflowFrac)) | 0,
		height: (lEyeH * (1+overflowFrac)) | 0,
		x: (face.e_ll.x - lEyeW*overflowFrac*.5) | 0,
		y: (face.e_lu.y - lEyeH*overflowFrac*.5) | 0,
		crop: "crop",
		gravity: "custom",
		effect: "contrast:50"
	};

	var rEyeW = face.e_rr.x - face.e_rl.x;
	var rEyeH = face.e_rd.y - face.e_ru.y;

	var rEyeTransform = {
		radius: (rEyeW/2) | 0,
		background: "#0e0412",
		width: (rEyeW * (1+overflowFrac)) | 0,
		height: (rEyeH * (1+overflowFrac)) | 0,
		x: (face.e_rl.x - rEyeW*overflowFrac*.5) | 0,
		y: (face.e_ru.y - rEyeH*overflowFrac*.5) | 0,
		crop: "crop",
		gravity: "custom",
		effect: "contrast:50"
	};

	inText.image.transforms = inText.image.transforms || {};
	inText.image.transforms.mouth = Textuality.transformImage(inText.image._id,mouthTransform);
	inText.image.transforms.lEye = Textuality.transformImage(inText.image._id,lEyeTransform);
	inText.image.transforms.rEye = Textuality.transformImage(inText.image._id,rEyeTransform);

	inText.purpose.type = 'faceCrops';
};

var checkActivityText = function(inText,participant) {
	if(checkEmotionText(inText,participant))
		return true;

	if(!!inText.image) {
		if(!!inText.image.face && isGoodSelfie(inText.image.face)) {
			doFaceCrops(inText,participant);
			return true;
		}

		inText.purpose.type = 'imageFeed';
		inText.image.transforms = inText.image.transforms || {};
		inText.image.transforms.square = Textuality.transformImage(inText.image._id,{width: 200, height: 200, crop: "fill"});

		if(inText.body.length > 0)
			return false;
		return true;
	}

	return false;
};

var checkEmotionText = function(inText,participant) {
	var body = inText.body.toLowerCase();
	var emotion = "";
	if(body.indexOf('#happy') != -1) {
		emotion = "happy";
	}
	else if(body.indexOf('#angry') != -1) {
		emotion = "angry";
	}
	else if(body.indexOf('#surprised') != -1) {
		emotion = "suprised";
	}
	else
		return false;

	inText.purpose = {
		'type': 'emotion',
		'emotion': emotion,
		'score': 0
	};

	if(!inText.image) {
		Meteor.call('autoText_send',participant,"EMOTION_NO_IMAGE");
	}
	else if (!inText.image.face) {
		Meteor.call('autoText_send',participant,"EMOTION_NO_FACE");
	}
	else {
		var emotionObj = inText.image.face.emotion;
		if(!!emotionObj[emotion]) {
			var score = emotionObj[emotion];
			inText.image.transforms = inText.image.transforms || {};
			inText.image.transforms.emotion = Textuality.transformImage(inText.image._id,{width: 200, height: 235, crop: "thumb", gravity: "rek_face", sign_url: true});
		}
		else
			var score = 0;

		inText.purpose.score = score;

		if(score >= .5)
			Meteor.call('autoText_send',participant,"EMOTION_"+emotion.toUpperCase()+"_SUCCEED",undefined,score*100);
		else
			Meteor.call('autoText_send',participant,"EMOTION_"+emotion.toUpperCase()+"_FAIL",undefined,score*100);
	}
	return true;
};

var handleImage = function(twJson,inText) {
	if(twJson.MediaContentType0.indexOf('image') != 0)
		return;

	var imageObj = Textuality.uploadImage(twJson.MediaUrl0);

	inText.image = {
		_id: imageObj.public_id,
		width: imageObj.width,
		height: imageObj.height,
		url: imageObj.url
	};

	var faceObj = imageObj.info.detection.rekognition_face;
	if(!!faceObj.data) {
		inText.image.face = faceObj.data[0];
		console.log(inText.image.face);
	}
};
