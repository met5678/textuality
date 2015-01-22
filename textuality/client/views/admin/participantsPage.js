Template.adminParticipants.helpers({
	activeParticipants: function() {
		return 0;
	},

	totalParticipants: function() {
		return 0;
	},

	participants: function() {
		return Participants.find();
	}
});