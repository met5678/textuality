Template.checkpointsPage.helpers({
	numCheckpoints: function() {
		return Checkpoints.find().count();
	},

	numCheckins: function() {
		return 0;
	}
});

Template.checkpointsTable.helpers({
	checkpoints: function() {
		return Checkpoints.find();
	},

	numCheckins: function() {
		return this.checkins.length;
	}
});


Template.checkpointsPage.events({
	'submit form.checkpoint-add-form': function(e) {
		e.preventDefault();
		
		var checkpoint = {
			_id: $(e.target).find('[name=hashtag]').val(),
			location: $(e.target).find('[name=location]').val(),
			tickerText: $(e.target).find('[name=tickerText]').val(),
			userText: $(e.target).find('[name=userText]').val(),
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

Template.checkpointsTable.events({
	'click .checkpoint-delete': function(e) {
		var checkpoint = $(e.currentTarget).parents('tr').children().first().html();
		Checkpoints.remove(checkpoint);
	}
});
