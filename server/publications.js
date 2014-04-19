Meteor.publish('inTexts', function(query,options) {
	return InTexts.find(query,options);
});

Meteor.publish('groupTexts', function(options) {
	return InTexts.find({'favorite': { $ne:0 }},options);
});

Meteor.publish('participants', function(options) {
	return Participants.find({},options);
});

Meteor.publish('singleParticipant', function(id) {
	return id && Participants.find(id);
});

Meteor.publish('participantInTexts', function(id) {
	return id && InTexts.find({participant:id});
});

Meteor.publish('participantOutTexts', function(id) {
	return id && OutTexts.find({participant:id});
});

Meteor.publish('participantsLite', function() {
	return Participants.find({'status':'Active'},{fields: {alias:1,geo:1,texts_sent:1,status:1,checkins_complete:1}});
});

Meteor.publish('outTexts', function(query,options) {
	return OutTexts.find(query,options);
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

Meteor.publish('feedTexts', function(limit) {
	return InTexts.find({ 'purpose.type':'feed' }, { sort: { time : -1 }, limit: limit });
});

Meteor.publish('leaderParticipants', function(limit) {
	return Participants.find({}, { sort: { texts_sent: -1}, limit: limit, fields: {alias: 1, texts_sent: 1}});
});

Meteor.publish("featuredText", function(group) {
	return InTexts.find({ favorite:group },{sort: {time: -1}, limit:1});
});