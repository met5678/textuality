Template.adminCheckpoints.helpers({
	numCheckpoints: function() {
		return Checkpoints.find().count();
	},

	numCheckins: function() {
		return 0;
	}
});

Template.adminCheckpointsTable.helpers({
	checkpoints: function() {
		return Checkpoints.find();
	}
});

Template.adminCheckpointRow.helpers({
	numCheckins: function() {
		return this.checkins.length;
	}
});

Template.createCheckpoint.rendered = function() {
	$('.text-character-count').each(function(i,el) {
		var countEl = $(el);
		var counterEl = countEl.next('.text-character-counter'); 
		initCharacterCounter(countEl,counterEl);
	});
};

Template.createCheckpoint.events({
	'submit form.checkpoint-add-form': function(e) {
		e.preventDefault();
		
		var checkpoint = {
			_id: $(e.target).find('[name=_id]').val(),
			location: $(e.target).find('[name=location]').val(),
			tickerText: $(e.target).find('[name=tickerText]').val(),
			userText: $(e.target).find('[name=userText]').val(),
			checkins: []
		};
		
		Checkpoints.insert(checkpoint);

		$(e.target).find('input').val('');
		$(e.target).find('textarea').val('');
	},

	'click .create-checkpoint-clear':function(e) {
		$('form.checkpoint-add-form').find('input,textarea').val('');
	},

	'click .checkins-clearall-btn': function(e) {
		if(confirm("Clear All Checkins: Are you sure?"))
			Meteor.call('checkpoint_clearCheckins');
	},

	'click .checkins-deleteall-btn': function(e) {
		if(confim("Delete All Checkpoints: Are you sure?"))
			Meteor.call('checkpoint_deleteCheckpoints')
	}
});

Template.adminCheckpointRow.events({
	'click .checkpoint-delete': function(e) {
		Checkpoints.remove(this._id);
	}
});
