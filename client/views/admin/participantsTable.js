Template.adminParticipantRow.helpers({
	textsPerHour: function() {
		return 'TBD';
	},

	aliasField: function() {
		return this.alias + ' (#' + (this.old_aliases.length+1) + ')';
	},

	status: function() {
		var labelClass = '';
		if(this.status == 'Active') {
			labelClass = 'label-success';
		}
		else if(this.status == 'Banned') {
			labelClass = 'label-important';
		}
		return new Handlebars.SafeString('<span class="label '+labelClass+'">'+this.status+'</span>');
	},

	numCheckins: function() {
		var numTotal = Checkpoints.find().count();
		if(_.isArray(this.checkins)) {
			return this.checkins.length+"/"+numTotal;
		}
		return "0/"+numTotal;
	},

	superUser: function() {
		var btnClass = 'btn-default';
		var btnText = 'No';
		if(this.super_user) {
			btnClass = 'btn-primary';
			btnText = 'Yes';
		}
		return new Handlebars.SafeString('<button class="btn btn-xs btn-super-user '+btnClass+'">'+btnText+'</span>');
	}
});

Template.adminParticipantRow.events({
	'click .participant-details':function(e) {
		e.preventDefault();
		Meteor.Router.to(Meteor.Router.participantPagePath(this._id));
	},
	'click .participant-text':function(e) {
		e.preventDefault();
		Session.set("preComposeTextParticipants",[{_id:this._id, alias:this.alias }]);
	},
	'click .btn-super-user':function(e) {
		e.preventDefault();
		if($(e.target).hasClass('btn-primary')) {
			Participants.update(this._id,{$set:{super_user:false}});
		}
		else {
			Participants.update(this._id,{$set:{super_user:true}});
		}
	}
});