Template.composeTextModal.events({
	'submit form.compose-text-form': function(e) {
		var message = sendText();
		if(message != 'success') {
			$('#composeText').find('.composetext-error').html(message);
			return;
		}
		var modalEl = $('#composeText');
		modalEl.modal('hide');
	},
	'keypress .composetext-body, keyup .composetext-body':function(e) {
		var jqEl = $(e.target);
		var counterEl = jqEl.next('.character-counter');
		var remaining = 160-jqEl.val().length;
		counterEl.html(remaining);
		if(remaining >= 0) {
			counterEl.removeClass('text-error');
		}
		else {
			counterEl.addClass('text-error');
		}
	},
	'click .composetext-add':function(e) {
		var num = $(e.currentTarget).attr('data-num');
		addParticipants(num,'random');
	},
	'click .composetext-random':function(e) {
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