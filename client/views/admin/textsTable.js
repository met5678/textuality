Template.adminTextRow.helpers({
	favoriteColorClass: function() {
		switch(this.favorite) {
			case 1:
				return 'text-warning';
			case 2:
				return 'text-danger';
			case 3:
				return 'text-success';
			case 4:
				return 'text-info';
		}
		return '';
	},

	status: function() {
		if(!!this.moderation && !this.moderation.passed)
			return new Handlebars.SafeString('<span class="label label-danger">'+this.moderation.status+' ('+this.moderation.score+')</span>');			
		else if(!!this.purpose && this.purpose.type == 'checkin')
			return Spacebars.SafeString('<span class="label label-warning">Check-in</span>');
		else if(!!this.purpose && this.purpose.type == 'system')
			return Spacebars.SafeString('<span class="label label-default">System</span>');
		else if(!!this.purpose && this.purpose.type == 'feed')
			return Spacebars.SafeString('<span class="label label-success">Feed</span>');
	},

	directionClass: function() {
		if(!!this.participant && this.participant != 'master')
			return ''
		else
			return 'active'
	},

	isMaster: function() {
		return this.participant == 'master';
	}
});

Template.adminTextRow.events({
	'click .text-table-mention': function() {
		Session.set('composeTextTarget','screen');
		var composeTextBody = $('#composeTextBody');
		var currentComposeText = composeTextBody.val();
		if(currentComposeText.length)
			currentComposeText += " @"+this.alias;
		else
			currentComposeText = "@"+this.alias;
		composeTextBody.val(currentComposeText);
		composeTextBody.focus();
		composeTextBody[0].setSelectionRange(currentComposeText.length,currentComposeText.length)
		composeTextBody.trigger('keyup');
	},

	'click .text-table-reply': function() {
		Session.set('composeTextTarget','user');
		ComposeTextParticipants.insert({_id:this.participant,alias:this.alias});
	},

	'click .text-table-favorite': function() {
		favorite = (this.favorite+1)%5;
		InTexts.update(this._id,{$set:{ favorite:favorite }});
	}
});