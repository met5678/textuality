Meteor.publish('inTexts', function(limit) {
	return InTexts.find({}, { sort: { time : -1 }, limit: limit });
});

Meteor.publish('feedTexts', function(limit) {
	return InTexts.find({ 'purpose.type':'feed' }, { sort: { time : -1 }, limit: limit });
});

Meteor.publish('participants', function() {
	return Participants.find();
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

Meteor.publish('checkpoints', function() {
	return Checkpoints.find();
});

Meteor.publish('checkpointsLite', function() {
	return Checkpoints.find({},{fields: {_id:1}});
});

Meteor.publish('autoTexts', function() {
	return AutoTexts.find();
});

Meteor.publish('screenSettings', function() {
	return ScreenSettings.find();
});