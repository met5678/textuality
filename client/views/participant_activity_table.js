Template.participantActivityTable.helpers({
	texts: function() {
		var allTexts = [].concat(InTexts.find({'participant':this._id}).fetch(),OutTexts.find({'participants.participant_id':this._id}).fetch());
		allTexts = _.sortBy(allTexts,function(text) {
			return text.time.valueOf()*-1;
		});
		return allTexts;
	}
});

Template.participantActivityRow.helpers({
	rowClass: function() {
		if(this.alias) {
			return '';
		}
		return 'info';
	}
});