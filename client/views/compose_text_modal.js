Template.composeTextModal.events({
	'click .composetext-send': function(e) {
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

var sendText = function() {
	var modalEl = $('#composeText');
	var toScreen = modalEl.find('[name=recipientType]:checked').val() == 'screen';
	var body = modalEl.find('[name=body]').val();

	if(body.length == 0) {
		return 'Please type a body';
	}

	if(toScreen) {
		Meteor.call('inText_sendMasterText',body);
		return 'success';
	}

	else {
		console.log("Preparing user text");
		var participants = Session.get("composeTextParticipants");
		if(!_.isArray(participants) || participants.length == 0) {
			return 'Please specify some recipients';
		}
		else if(body.length > 160) {
			return 'Length of body text is too long';
		}
		
		var outText = {
			body:body,
			purpose: { type:'manual' }
		};
		Meteor.call('outText_send',outText,participants);
		console.log("Sent text");
		return 'success';
	}
};

var addParticipants = function(num,type) {
	var selectedParticipants = Session.get("composeTextParticipants");
	if(!_.isArray(selectedParticipants)) {
		selectedParticipants = [];
		selectedParticipantIDs = [];
	}
	else {
		selectedParticipantIDs = _.pluck(selectedParticipants,'_id');
	}

	var newParticipants = [];
	if(type == 'random') {
		newParticipants = Meteor.call('participant_getRandomParticipants',num,selectedParticipantIDs, function(err,data) {
			var selectedParticipants = Session.get("composeTextParticipants");
			selectedParticipants = $.extend([],selectedParticipants);
			selectedParticipants = selectedParticipants.concat(data);
			Session.set("composeTextParticipants", selectedParticipants);
		});
	}
};

Template.composeTextModal.rendered = function() {
	var modalEl = $(this.find('#composeText'));
	var aliasEl = modalEl.find('.composetext-alias');

	var autocompleteSource = function(query) {
		var selectedParticipants = Session.get("composeTextParticipants");
		if(!_.isArray(selectedParticipants)) {
			selectedParticipants = [];
		}
		else {
			selectedParticipants = _.pluck(selectedParticipants,'_id');
		}
		var participants = Participants.find( { _id: { $nin: selectedParticipants }, alias: { $regex: query + '.*', $options: 'i' } }, { fields: { alias: 1 }, limit: 8 } ).fetch();
		return _.pluck(participants,'alias');
	};

	var autocompleteSelect = function(item) {
		var participant = Participants.findOne( { alias: item }, { fields: { alias: 1 } } );
		var selectedParticipants = Session.get("composeTextParticipants");
		if(!_.isArray(selectedParticipants)) {
			selectedParticipants = [];
		}
		selectedParticipants = $.extend([], selectedParticipants);
		selectedParticipants.push(participant);
		Session.set("composeTextParticipants", selectedParticipants);
	};

	aliasEl.typeahead({
		source: autocompleteSource,
		updater: autocompleteSelect
	});

	modalEl.unbind('show');
	modalEl.on('show', function(e) {
		var preParticipants = Session.get("preComposeTextParticipants");
		if(_.isArray(preParticipants)) {
			console.log("Array");
			console.log(preParticipants);
			Session.set("composeTextParticipants",preParticipants);
			Session.set("preComposeTextParticipants",null);
		}
		else {
			console.log("Not Array");
			Session.set("composeTextParticipants", []);
		}
		modalEl.find('[name=body]').val('');
		modalEl.find('.composetext-error').html('');
	});
};

Template.composeTextModal.helpers({
	composeTextParticipants: function() {
		var selectedParticipants = Session.get("composeTextParticipants");
		if(_.isArray(selectedParticipants)) {
			return selectedParticipants;
		}
		else {
			return [];
		}
	}
});

Template.composeTextParticipant.events({
	'click .participant-delete':function() {
		var selectedParticipants = Session.get("composeTextParticipants");
		if(!_.isArray(selectedParticipants)) {
			selectedParticipants = [];
		}
		selectedParticipants = $.extend([], selectedParticipants);
		var thisID = this._id;
		selectedParticipants = _.reject(selectedParticipants, function(object) {
			return EJSON.equals(object._id,thisID);
		});
		Session.set("composeTextParticipants", selectedParticipants);
	}
});