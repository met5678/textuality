Meteor.publish('inTexts', function(options) {
	return InTexts.find({},options);
});

Meteor.publish('groupTexts', function(options) {
	return InTexts.find({'favorite': { $ne:0 }},options);
});

Meteor.publish('feedTexts', function(limit) {
	return InTexts.find({ 'purpose.type':'feed' }, { sort: { time : -1 }, limit: limit });
});

Meteor.publish('participants', function(options) {
	return Participants.find({},options);
});

Meteor.publish('participantsLite', function() {
	return Participants.find({'status':'Active'},{fields: {alias:1,geo:1,texts_sent:1,status:1,checkins_complete:1}});
});

Meteor.publish('outTexts', function(limit) {
	return OutTexts.find({}, { sort: { time: -1 }, limit: limit });
});

Meteor.publish('aliases', function() {
	return Aliases.find();
});

Meteor.publish('badges',function() {
	return Badges.find();
});

Meteor.publish('checkpoints', function() {
	return Checkpoints.find();
});

Meteor.publish('checkpointsLite', function() {
	return Checkpoints.find({},{fields: {_id:1}});
});

Meteor.publish('autoTexts', function() {
	return AutoTexts.find();
});

Meteor.publish('autoTextTemplates', function() {
	return AutoTextTemplates.find();
});

Meteor.publish('screenSettings', function() {
	return ScreenSettings.find();
});