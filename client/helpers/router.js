/*feedTextSubscr = null;
participantLiteSubscr = null;
checkpointsLiteSubscr = null;
screenSettingsSubscr = null;

inTextSubscr = null;
participantSubscr = null;
outTextSubscr = null;
aliasSubscr = null;
checkpointSubscr = null;
autoTextSubscr = null;

screenSettingsSubscr = Meteor.subscribe('screenSettings');

var screenSubscriptions = function() {
	if(!_.isNull(inTextSubscr)) {
		inTextSubscr.stop();
		inTextSubscr = null;
	}
	if(!_.isNull(participantSubscr)) {
		participantSubscr.stop();
		participantSubscr = null;
	}
	if(!_.isNull(outTextSubscr)) {
		outTextSubscr.stop();
		outTextSubscr = null;
	}
	if(_.isNull(feedTextSubscr)) {
		Meteor.subscribe('feedTexts',20);
	}
	if(_.isNull(participantLiteSubscr)) {
		Meteor.subscribe('participantsLite');
	}
	if(_.isNull(checkpointsLiteSubscr)) {
		Meteor.subscribe('checkpointsLite');
	}
	if(_.isNull(screenSettingsSubscr)) {
		Meteor.subscribe('screenSettings');
	}
}

var adminSubscriptions = function() {
	if(!_.isNull(feedTextSubscr)) {
		feedTextSubscr.stop();
		feedTextSubscr = null;
	}
	if(!_.isNull(participantLiteSubscr)) {
		participantsLiteSubscr.stop();
		participantsLiteSubscr = null;
	}
	if(_.isNull(inTextSubscr)) {
		Meteor.subscribe('inTexts');
	}
	if(_.isNull(participantSubscr)) {
		Meteor.subscribe('participants');
	}
	if(_.isNull(outTextSubscr)) {
		Meteor.subscribe('outTexts');
	}
	if(_.isNull(aliasSubscr)) {
		Meteor.subscribe('aliases');
	}
	if(_.isNull(checkpointSubscr)) {
		Meteor.subscribe('checkpoints');
	}
	if(_.isNull(autoTextSubscr)) {
		Meteor.subscribe('autoTexts');
	}
}

Meteor.Router.add({
	'/': {
		to:'audienceScreen',
		and:screenSubscriptions
	},
	'/934admin': {
		to:'textsPage',
		and:adminSubscriptions
	},
	'/934admin/texts': {
		to:'textsPage',
		and:adminSubscriptions
	},
	'/934admin/participants': {
		to:'participantsPage',
		and:adminSubscriptions
	},
	'/934admin/participants/:id': {
		to:'participantPage',
		and: function(id) {
			Session.set('currentParticipantId',id);
			adminSubscriptions();
		}
	},
	'/934admin/aliases': {
		to:'aliasesPage',
		and:adminSubscriptions
	},
	'/934admin/checkpoints': {
		to:'checkpointsPage',
		and:adminSubscriptions
	},
	'/934admin/autoTexts': {
		to:'autoTextsPage',
		and:adminSubscriptions
	},
	'/934admin/screenControl': {
		to:'screenControlPage',
		and:adminSubscriptions
	},
	'/*': {
		to:'audienceScreen',
		and:screenSubscriptions
	}		
});*/