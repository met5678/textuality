Meteor.startup(function() {
	AutoTextTemplates.remove({});
	AutoTextTemplates.insert({
		'_id':'AUTO_WELCOME',
		'description':'Welcome',
		'number':false
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_ALIAS_CHANGE',
		'description':'Alias change',
		'number':false
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_SENT_N_TEXTS',
		'description':'Sent [N] texts',
		'number':true
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_TOTAL_N_TEXTS',
		'description':'Total collective [N] texts',
		'number':true
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_TOP_N_TEXTER',
		'description':'Top [N] texter',
		'number':true
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_CHECKPOINTS_DONE',
		'description':'Checkins: Completed all',
		'number':false
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_CHECKPOINTS_FIRST',
		'description':'Checkins: First checkin',
		'number':false
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_CHECKPOINTS_DUPLICATE',
		'description':'Checkins: Duplicate checkpoint',
		'number':false
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_MODERATION_WARNING',
		'description':'Moderation: [N]th warning',
		'number':true
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_MODERATION_LONGTEXT',
		'description':'Moderation: Long Text',
		'number':false
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_MODERATION_BANNED',
		'description':'Moderation: Banned',
		'number':false
	});
});