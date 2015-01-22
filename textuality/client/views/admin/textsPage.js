Template.adminTexts.helpers({
	totalInTexts: function() {
		return 0;
	},

	totalOutTexts: function() {
		return 0;
	},

	allTexts: function() {
	    var inTexts = InTexts.find({"purpose.type":"feed","moderation.passed":true},{sort:{time:-1}}).fetch();
	    var outTexts = OutTexts.find({"purpose":"manual"}).fetch();
	    var allTexts = inTexts.concat(outTexts);
		allTexts = _.sortBy(allTexts,function(text) {
			return text.time.valueOf()*-1;
		});
		return allTexts;

	}
});

Template.adminTextGroup.helpers({
	count: function() {
		return InTexts.find({'favorite':Number(this)}).count();
	},

	colorClass: function() {
		switch(Number(this)) {
			case 1:
				return 'text-warning'
			case 2:
				return 'text-danger'
			case 3:
				return 'text-success'
			case 4:
				return 'text-info'
		}
	}
})

Template.adminTextGroup.events({
	'click .text-group-reply': function() {
		Session.set('composeTextTarget','user');
		var favoriteNum = Number(this);
		var groupTexts = InTexts.find({'favorite':favoriteNum});
		var participants = _.uniq(_.pluck(groupTexts.fetch(),'participant'));
		_.each(participants, function(id) {
			ComposeTextParticipants.insert({
				_id:id,
				alias:InTexts.findOne({'participant':id,'favorite':favoriteNum}).alias
			});
		});
	},

	'click .text-group-mention': function() {
		Session.set('composeTextTarget','screen');
		var favoriteNum = Number(this);
		var groupTexts = InTexts.find({'favorite':favoriteNum});
		var replies = _.map(_.uniq(_.pluck(groupTexts.fetch(),'alias')),function(alias) {
			return '@'+alias;
		});
		var composeTextBody = $('#composeTextBody');
		var currentComposeText = composeTextBody.val();
		if(currentComposeText.length)
			currentComposeText += " "+replies.join(' ');
		else
			currentComposeText = replies.join(' ');
		composeTextBody.val(currentComposeText);
		composeTextBody.focus();
		composeTextBody[0].setSelectionRange(currentComposeText.length,currentComposeText.length)
		composeTextBody.trigger('keyup');
	},

	'click .text-group-clear': function() {
		Meteor.call('inText_clearFavorites',Number(this));
	}
})