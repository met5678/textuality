AutoTextTemplates = new Meteor.Collection('autoTextTemplates');

AutoTexts = new Meteor.Collection('autoTexts');
AutoTexts.allow({
	insert: function(userId, doc) {
		return Roles.userIsInRole(userId,'admin');
	},
	remove: function(userId, doc) {
		return Roles.userIsInRole(userId,'admin');
	}
});

if(Meteor.isServer) {
	AutoTexts._ensureIndex({ random : "2d" });
}

Meteor.methods({
	autoText_send: function(participant, type, number) {
		console.log("Going to send text for " + type + " " + number);
		autoTextQuery = { type:type, random: { $near: [Math.random(),0] }, destination:'user' };
		if(number) {
			autoTextQuery.number = number;
		}
		var autoText = AutoTexts.findOne(autoTextQuery);
		if(autoText) {
			var textBody = autoText.body.replace('[alias]',participant.alias);
			var outText = {
				body:textBody,
				favorite: false,
			};
			Meteor.call('outText_send',outText,participant,'system');
		}
		else {
			console.log("No user autoText found for type: " + type+","+number);
		}

		autoTextQuery.destination = 'screen';
		autoText = AutoTexts.findOne(autoTextQuery);
		if(autoText) {
			var textBody = autoText.body.replace('[alias]',participant.alias);
			Meteor.call('inText_sendMasterText',textBody);
		}
		else {
			console.log("No screen autoText found for type: " + type+","+number);
		}
	},

	autoText_send_custom: function(participant, body, type) {
		var textBody = body.replace('[alias]',participant.alias);
		var outText = {
			body:textBody,
			purpose: {
				type: type,
				description: ''
			},
			favorite: false,
			time: new Date()
		};
		Meteor.call('outText_send',outText,participant,'system');
	},

	autoText_delete_all: function() {
		AutoTexts.remove({});
	}

});