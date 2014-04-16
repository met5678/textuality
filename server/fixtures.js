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
			time: new Date()
		});
		InTexts.insert({
			body:"Test test text text. A normal text can be up to 160 characters. That sure is long, Bobby. You bet, sue! I just had a cranial anneurism. It was bad.",
			participant: '+12024948427',
			alias: 'EroticRotunda',
			checkins: 3,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date()
		});
		InTexts.insert({
			body:"Test test text text",
			participant: '+12024948427',
			alias: 'EroticRotunda',
			checkins: 3,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date()
		});
		InTexts.insert({
			body:"Test test text text",
			participant: '+12024948427',
			alias: 'EroticRotunda',
			checkins: 3,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date()
		});
		InTexts.insert({
			body:"Test test text text",
			participant: '+12024948427',
			alias: 'EroticRotunda',
			checkins: 3,
			moderation: 'passed',
			purpose: 'feed',
			favorite: true,
			time: new Date()
		});
	}
});