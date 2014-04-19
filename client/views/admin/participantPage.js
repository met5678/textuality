Template.adminParticipant.helpers({
	participantTexts: function() {
	    var inTexts = InTexts.find({participant:this._id}).fetch();
	    var outTexts = OutTexts.find({'participants.participant_id':this._id}).fetch();
	    var allTexts = inTexts.concat(outTexts);
		allTexts = _.sortBy(allTexts,function(text) {
			return text.time.valueOf()*-1;
		});
		return allTexts;
	}
});