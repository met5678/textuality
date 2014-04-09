Template.participantPage.helpers({
	currentParticipant: function() {
		return Participants.findOne(Session.get('currentParticipantId'));
	},

	oldAliases: function() {
		var buffer = "";
		if(this.old_aliases && this.old_aliases.length > 0) {
			_.each(this.old_aliases, function(alias) {
				buffer += alias.alias + "("+alias.texts+" texts)<br />";
			}); 
		}
		else {
			buffer = "--";
		}
		return new Handlebars.SafeString(buffer);
	},

	purpose: function() {
		return 'implement';
	},

	checkinsList: function() {
		return this.checkins.join(', ');
	}
});