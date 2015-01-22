Template.adminBadges.helpers({
	totalAwarded: function() {
		return 0;
	},

	autoBadges: function() {
		return Badges.find({type:'auto'});
	},

	manualBadges: function() {
		return Badges.find({type:'manual'});
	}
});

Template.adminBadges.events({
	'submit form.checkpoint-add-form': function(e) {
		e.preventDefault();
		
		var checkpoint = {
			_id: $(e.target).find('[name=hashtag]').val(),
			location: $(e.target).find('[name=location]').val(),
			tickerText: $(e.target).find('[name=tickerText]').val(),
			userText: $(e.targespt).find('[name=userText]').val(),
			checkins: []
		};
		
		Checkpoints.insert(checkpoint);

		$(e.target).find('input').val('');
		$(e.target).find('textarea').val('');
	},

	'click .checkins-clearall-btn': function(e) {
		if(confirm("Clear All Checkins: Are you sure?")) {
			Meteor.call('checkpoint_clearCheckins');
		}
	}
});

Template.adminBadges.events({
	'click .badge-delete': function(e) {
		Badges.remove(this._id);
	}
});

Template.badgesTable.helpers({
	isAuto: function() {
		return this.type == 'auto';
	}
})