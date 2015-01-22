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
		'_id':'AUTO_PARTICIPANT_EXIT',
		'description':'Participant exit',
		'number':false
	});
	AutoTextTemplates.insert({
		'_id':'AUTO_PARTICIPANT_RETURN',
		'description':'Participant return',
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

	var order = 0;
	ScreenSettings.remove({});
	ScreenSettings.insert({
		_id:"actionText",
		order:order++,
		description:"Action Text",
		dataType:"text",
		value:"",
	});
	ScreenSettings.insert({
		_id:"widgetClass",
		order:order++,
		description:"Widget",
		dataType:"options",
		value:"normal",
		options:[
			{
				value:"normal",
				description:"No widget"
			},
			{
				value:"leaderboard",
				description:"Leaderboard"
			},
			{
				value:"question",
				description:"Question/Announcement box"
			},
			{
				value:"featured-text",
				description:"Featured text box"
			}
		]
	});
	ScreenSettings.insert({
		_id:"questionText",
		order:order++,
		description:"Question/Announcement box text",
		dataType:"text",
		value:""
	});
	ScreenSettings.insert({
		_id:"featuredTextLabel",
		order:order++,
		description:"Featured text box label",
		dataType:"text",
		value:""
	});
	ScreenSettings.insert({
		_id:"featuredTextGroup",
		order:order++,
		description:"Featured box text group",
		dataType:"options",
		value:"2",
		options:[
			{
				value:1,
				description:"Yellow"
			},
			{
				value:2,
				description:"Red"
			},
			{
				value:3,
				description:"Green"
			},
			{
				value:4,
				description:"Blue"
			},
		]
	})
	ScreenSettings.insert({
		_id:"showHostess",
		order:order++,
		description:"Show hostess",
		dataType:"boolean",
		value:true
	});
	ScreenSettings.insert({
		_id:"hostessClass",
		order:order++,
		description:"Hostess behavior",
		dataType:"options",
		value:"standing",
		options:[
			{
				value:"standing",
				description:"Standing"
			},
			{
				value:"standing-selfie",
				description:"Standing: selfie"
			},
			{
				value:"floating",
				description:"Floating"
			},
			{
				value:"laying",
				description:"Laying"
			}
		]
	});
	ScreenSettings.insert({
		_id:"rainDensity",
		order:order++,
		description:"Rain Density",
		dataType:"range",
		value:0,
		min:0,
		max:100
	});
	ScreenSettings.insert({
		_id:"rainSpeed",
		order:order++,
		description:"Rain Speed",
		dataType:"range",
		value:0,
		min:0,
		max:100
	});
	ScreenSettings.insert({
		_id:"rainColor",
		order:order++,
		description:"Rain Color",
		dataType:"color",
		value:"#66AAAA"
	})
	ScreenSettings.insert({
		_id:"windDirection",
		order:order++,
		description:"Wind Direction",
		dataType:"range",
		value:20,
		min:-100,
		max:100
	});

	Badges.remove({type:'auto'});
	Badges.insert({
		name:'50 Texts',
		icon:'fa-umbrella',
		color:'#FFAA22',
		type:'auto',
		awarded:0
	});
	Badges.insert({
		name:'Top 10 Texter',
		icon:'fa-trophy',
		color:'#FFFFAA',
		type:'auto',
		awarded:0
	});
	Badges.insert({
		name:'All 10 Check-ins',
		icon:'fa-tint',
		color:'#3355FF',
		type:'auto',
		awarded:0
	});
});