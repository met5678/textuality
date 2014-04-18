Template.adminComposeText.events({
	'badges': function() {
		return Badges.find({'type':'manual'});
	}
});

Template.adminComposeText.events({
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

	'click #composeTextToScreen':function(e) {
		$('#composeTextBadgeArea').hide();
	},

	'click #composeTextToUser':function(e) {
		$('#composeTextBadgeArea').show();
	}
});