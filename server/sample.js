Meteor.startup(function() {
	InTexts.remove({});
	if(InTexts.find().count() == 0) {
		InTexts.insert({
			body:"Test test text text",
			participant: '+12024948427',
			alias: 'EroticRotunda',
			checkins: 3,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date((new Date()).valueOf()-Math.random()*600000)
		});
		InTexts.insert({
			body:"Test test text text. A normal text can be up to 160 characters. That sure is long, Bobby. You bet, sue! I just had a cranial anneurism. It was bad.",
			participant: '+16102481697',
			alias: 'HomeSlice',
			checkins: 2,
			moderation: 'passed',
			purpose: 'feed',
			favorite: false,
			time: new Date((new Date()).valueOf()-Math.random()*600000)
		});
		InTexts.insert({
			body:"Make sure to stay tuned for Corsten's Countdown",
			participant: '+12024948427',
			alias: 'EroticRotunda',
			checkins: 5,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date((new Date()).valueOf()-Math.random()*600000)
		});
		InTexts.insert({
			body:"Long nights make for sleepless days. I think.",
			participant: '+12024948427',
			alias: 'EroticRotunda',
			checkins: 6,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date((new Date()).valueOf()-Math.random()*600000)
		});
		InTexts.insert({
			body:"@AprilShowers boooooo",
			participant: '+16102481697',
			alias: 'HomeSlice',
			checkins: 2,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date((new Date()).valueOf()-Math.random()*600000)
		});
		InTexts.insert({
			body:"Quiet down sweetheart.",
			participant: 'master',
			alias: 'AprilShowers',
			checkins: 0,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date((new Date()).valueOf()-Math.random()*600000)
		});
		InTexts.insert({
			body:"Got Another!",
			participant: '+16102481697',
			alias: 'HomeSlice',
			checkins: 3,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date((new Date()).valueOf()-Math.random()*600000)
		});
		InTexts.insert({
			body:"Mee Too!",
			participant: '+12024948427',
			alias: 'EroticRotunda',
			checkins: 9,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date((new Date()).valueOf()-Math.random()*600000)
		});
	}

	Participants.remove({});
	Participants.insert({
		_id: '+12024948427',
		geo: {
			city:'Washingtdon',
			state:'DC',
			zip:20002
		},
		status: 'Active', // or 'Signed off' or 'Banned'
		joined: new Date((new Date()).valueOf()-Math.random()*3600000), // When joined
		recent: new Date(), // Most recent activity
		alias: 'EroticRotunda',
		old_aliases: ['OldAlias1,OldAlias2'],
		texts_sent_current_alias: 0,
		texts_sent: 0,
		texts_received: 0,
		moderated_texts:0,
		super_user:false, // Are they an admin?
		checkins: [] , // IDs of completed checkpoints
		checkins_complete: false,
		badges: [{
			_id:'random',
			name:'Top Texter',
			icon:'fa-star',
			color:'#FFAAAA'
		}],
		favorite:false,
		last_text_long: false,
		receiving_long_text: false,
		note:null,
		random:[Math.random(),0]
	});
	Participants.insert({
		_id: '+16102481697',
		geo: {
			city:'Philadelphia',
			state:'PA',
			zip:10001
		},
		status: 'Active', // or 'Signed off' or 'Banned'
		joined: new Date((new Date()).valueOf()-Math.random()*3600000), // When joined
		recent: new Date(), // Most recent activity
		alias: 'HomeSlice',
		old_aliases: ['OldAlias3,OldAlias4'],
		texts_sent_current_alias: 0,
		texts_sent: 0,
		texts_received: 0,
		moderated_texts:0,
		super_user:false, // Are they an admin?
		checkins: [] , // IDs of completed checkpoints
		checkins_complete: false,
		badges: [{
			_id:'random',
			name:'Leafy Goddess',
			icon:'fa-leaf',
			color:'#AAFFAA'
		}],
		favorite:false,
		last_text_long: false,
		receiving_long_text: false,
		note:null,
		random:[Math.random(),0]
	});

	Badges.remove({});
	Badges.insert({
		name:'Leafy Goddess',
		icon:'fa-leaf',
		color:'#AAFFAA',
		type:'manual'
	});
	Badges.insert({
		name:'Sexy dancer',
		icon:'fa-music',
		color:'#FFFAAA',
		type:'manual'
	});

});