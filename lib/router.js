Router.configure({
	loadingTemplate:'loading'
});

Router.map(function() {
	this.route('screen',{
		path: '/',
		template:'/screen-main',
		layoutTemplate:'layoutScreen',
		waitOn: function() {
			return Meteor.subscribe('inTexts', { sort: { time: -20 }, limit: 20});
		}
	});

	this.route('adminLogin', {
		path:'/admin/login',
		layoutTemplate:'layoutAdmin'
	});

	this.route('adminTexts', {
		path:'/admin/texts',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			return [Meteor.subscribe('inTexts', { sort: { time: -1 }, limit: 10 }), Meteor.subscribe('badges')];
		},
		data: function() {
			return {
				texts: InTexts.find({}, { sort: { time: -1 }, limit: 10 }),
				badges: Badges.find()
			}
		}
	});

	this.route('adminParticipants', {
		path:'/admin/participants',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			return Meteor.subscribe('participants', { sort: {joined:-1}, limit: 10 });
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
			return Meteor.subscribe('inTexts', { sort: { time: -1 }, limit: 10});
		}
	});

	this.route('adminScreenControl', {
		path:'/admin/screenControl',
		layoutTemplate:'layoutAdmin'
	});

	this.route('adminAliases', {
		path:'/admin/aliases',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			return Meteor.subscribe('aliases');
		}
	});

	this.route('adminAutoTexts', {
		path:'/admin/autoTexts',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			return Meteor.subscribe('autoTexts');
		}
	});

	this.route('adminBadges', {
		path:'/admin/badges',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			return Meteor.subscribe('badges');
		}
	});

	this.route('adminCheckpoints', {
		path:'/admin/checkpoints',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			return Meteor.subscribe('checkpoints');
		}
	});
});

var requireLogin = function(pause) {
	if(!Roles.userIsInRole(Meteor.userId(),'admin')) {
		if(Meteor.loggingIn())
			this.render(this.loadingTemplate);
		else
			this.render('adminLogin');
		pause();
	}
};

Router.onBeforeAction(requireLogin, {except:['screen','adminLogin']} );