Template.inTextsTable.helpers({
	inTexts: function() {
		return InTexts.find({},{sort: {time:-1}});
	}
});

Template.inTextRow.helpers({
	moderation: function() {
		if(this.moderation) {
			var labelClass = '';
			if(this.moderation.passed) {
				return 'OK ('+this.moderation.score+')';
			}
			else {
				return new Handlebars.SafeString('<span class="label label-important">'+this.moderation.status+' ('+this.moderation.score+')</span>');			
			}
		}
		else {
			return 'wrong';
		}
	},

	purpose: function() {
		if(this.purpose) {
			if(this.purpose.type == 'system') {
				return new Handlebars.SafeString('<span class="label">System</span><br />'+this.purpose.description);
			}
			else if(this.purpose.type == 'feed') {
				return new Handlebars.SafeString('<span class="label label-success">Feed</span>');
			}
			else if(this.purpose.type == 'mission') {
				return new Handlebars.SafeString('<span class="label label-info">Feed</span>');
			}
			else if(this.purpose.type == 'poll') {
				return new Handlebars.SafeString('<span class="label label-info">Feed</span>');
			}
		}
		return '--';
	},

	isMaster: function() {
		return this.participant == 'Prismadonna';
	}
});

Template.inTextRow.events({
	'click .intext-reply':function(e) {
		e.preventDefault();
		Session.set("preComposeTextParticipants",[Participants.findOne(this.participant, { fields: {alias:1} })]);
	}
});