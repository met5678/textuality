Meteor.startup(function() {
	ComposeTextParticipants = new Meteor.Collection(null);
	Session.set("composeTextTarget","screen");
	Session.set("composeTextBadge","");
});

Template.adminComposeText.helpers({
	'badges': function() {
		return Badges.find({'type':'manual'});
	},

	'target': function(value) {
		return Session.get("composeTextTarget") == value;
	},

	'targetScreenChecked': function() {
		if(Session.get("composeTextTarget") == 'screen')
			return 'checked'
	},

	'targetUserChecked': function() {
		if(Session.get("composeTextTarget") == 'user')
			return 'checked'
	},

	'composeTextParticipants': function() {
		return ComposeTextParticipants.find();
	},

	'composeTextBadge': function() {
		var badge = Session.get("composeTextBadge");
		if(badge) {
			return Spacebars.SafeString('<i class="fa '+badge.icon+'" style="color:'+badge.color+'"> '+badge.name+'</i>');
		}
		else {
			return 'None';
		}
	}
});

Template.adminComposeText.rendered = function() {
	initCharacterCounter(this.$('.text-character-count'),this.$('.text-character-counter'));
};

var clearForm = function() {
	$('#composeTextBody').val('').trigger('keyup');
	ComposeTextParticipants.remove({});
	Session.set("composeTextTarget","screen");
	Session.set("composeTextBadge","");
};

var addRandomParticipants = function(num) {
	var selectedParticipantIDs = _.pluck(ComposeTextParticipants.find().fetch(),"_id");
	var newParticipants = Meteor.call('participant_getRandomParticipants',num,selectedParticipantIDs, function(err,data) {
		if(err) {

		}
		else {
			_.each(data,function(participant) {
				ComposeTextParticipants.insert(participant);
			});
		}
	});
};

Template.adminComposeText.events({
	'submit form.compose-text-form': function(e) {
		e.preventDefault();

		var composedText = {
			target:Session.get("composeTextTarget"),
			body:$("#composeTextBody").val(),
		}

		if(Session.get("composeTextBadge"))
			composedText.badge = Session.get("composeTextBadge")._id;

		if(Session.get("composeTextTarget")=='user')
			composedText.participants = _.pluck(ComposeTextParticipants.find().fetch(),"_id");

		console.log(composedText);
	},

	'click .composetext-add':function(e) {
		var num = $(e.currentTarget).attr('data-num');
		addParticipants(num,'random');
	},

	'click #composeTextToScreen':function(e) {
		Session.set('composeTextTarget','screen');
	},

	'click #composeTextToUser':function(e) {
		Session.set('composeTextTarget','user');
	},

	'click #composeTextClear':function(e) {
		clearForm();
	},

	'click .compose-text-none-badge':function(e) {
		Session.set("composeTextBadge","");
	},

	'click #composeTextUserAdd1':function(e) {
		Session.set('composeTextTarget','user');
		addRandomParticipants(1);
	},

	'click #composeTextUserAdd5':function(e) {
		Session.set('composeTextTarget','user');
		addRandomParticipants(5);
	}
});

Template.adminComposeTextParticipant.events({
	'click .participant-delete':function(e) {
		ComposeTextParticipants.remove(this);
	}
});

Template.adminComposeTextBadge.events({
	'click a':function(e) {
		Session.set("composeTextBadge",this);
	}
});