Router.configure({
	loadingTemplate:'loading'
});

Router.map(function() {
	this.route('screen',{
		path: '/',
		template:'/screen-main',
		layoutTemplate:'layoutScreen'
	});

	this.route('adminTexts', {
		path:'/admin/texts',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			Meteor.subscribe('inTexts', { sort: { time: -1 }, limit: 10 });
		},
		data: function() {
			return {
				texts: InTexts.find({}, { sort: { time: -1 }, limit: 10 })
			}
		}
	});

	this.route('adminParticipants', {
		path:'/admin/participants',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			Meteor.subscribe('participants', { sort: {joined:-1}, limit: 10 });
		},
		data: function() {
			return {
				participants: Participants.find({}, { sort: {joined:-1}, limit: 10 })
			}
		}
	});

	this.route('adminParticipant', {
		path:'/admin/participants/:_id',
		layoutTemplate:'layoutAdmin',
		data: function() { return Participants.findOne(this.params._id); },
		waitOn: function() {
			Meteor.subscribe('inTexts', { sort: { time: -1 }, limit: 10});
		}
	});

	this.route('adminAliases', {
		path:'/admin/aliases',
		layoutTemplate:'layoutAdmin'
	});

	this.route('adminCheckpoints', {
		path:'/admin/checkpoints',
		layoutTemplate:'layoutAdmin'
	});

	this.route('adminScreenControl', {
		path:'/admin/screenControl',
		layoutTemplate:'layoutAdmin'
	});
});