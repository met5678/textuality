Template.participantsPage.helpers({
	participantsActive: function() {
		return Participants.find({status:'Active'}).count();
	},

	participantsTotal: function() {
		return Participants.find({}).count();
	}
});