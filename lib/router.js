Router.configure({
	loadingTemplate:'loading'
});

Router.map(function() {
	this.route('screen',{
		path: '/',
		template:'screenMain',
		layoutTemplate:'layoutScreen',
		waitOn: function() {
			return [
				Meteor.subscribe('feedTexts'),
				Meteor.subscribe('screenSettings'),
				Meteor.subscribe('leaderParticipants',10),
				Meteor.subscribe('featuredText',ScreenSettings.findOne("featuredTextGroup"))
			];
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
			return [
				Meteor.subscribe('inTexts', { sort: { time: -1 }, limit: 20 }),
				Meteor.subscribe('groupTexts'),
				Meteor.subscribe('badges')
			];
		},
		data: function() {
			return {
				texts: InTexts.find({}, { sort: { time: -1 }, limit: 20 }),
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
		waitOn: function() {
			return [
				Meteor.subscribe('singleParticipant', this.params._id),
				Meteor.subscribe('participantInTexts', this.params._id),
				Meteor.subscribe('participantOutTexts', this.params._id)
			];
		},
		data: function() { return Participants.findOne(this.params._id); }
	});

	this.route('adminScreenControl', {
		path:'/admin/screenControl',
		layoutTemplate:'layoutAdmin',
		waitOn: function() {
			return Meteor.subscribe('screenSettings');
		}
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
			return [
				Meteor.subscribe('autoTexts'),
				Meteor.subscribe('autoTextTemplates')
			];
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

	this.route('adminSystem', {
		path:'/admin/system',
		layoutTemplate:'layoutAdmin',
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

Router.onBeforeAction(requireLogin, {except:['screen','adminLogin','textHandler','textStatusHandler']} );