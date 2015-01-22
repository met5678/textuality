Template.autoTextsTable.helpers({
	autoTexts: function() {
		return AutoTexts.find();
	}
});

Template.createAutoText.helpers({
	autoTextTemplates: function() {
		return AutoTextTemplates.find({},{sort:{description:1}});
	},

	hasNumber: function() {
		if(Session.get('createAutoTextType')) {
			var autoTextTemplate = AutoTextTemplates.findOne(Session.get('createAutoTextType'));
			return !!autoTextTemplate && autoTextTemplate.number;
		}
	}
});

var resetValues = function() {
	var jqEl = $('form.autotext-add-form');
	jqEl.find('input[type!=radio]').val('');
	jqEl.find('textarea').val('');
};

Template.createAutoText.events({
	'submit form.autotext-add-form': function(e) {
		e.preventDefault();
		
		var autoText = {
			type: $(e.target).find('[name=type]').val(),
			destination: $(e.target).find('[name=toTarget]:checked').val(),
			body: $(e.target).find('textarea').val(),
			random:[Math.random(),0]
		};

		autoText.description = AutoTextTemplates.findOne(autoText.type).description;

		$(e.target).find('input[type=text]').val('');
		$(e.target).find('textarea').val('');

		try {
			autoText.number = parseInt($(e.target).find('[name=number]').val());
		} catch(e) {}

		if(typeof autoText.number == 'number' && _.isNaN(autoText.number)) {
			delete autoText.number;
		}
		
		AutoTexts.insert(autoText);

		resetValues();
	},

	'click .create-autotext-clear': function(e) {
		resetValues();
	},

	'click .autotexts-deleteall-btn': function(e) {
		if(confirm("Delete all autotexts: Are you sure?")) {
			Meteor.call('autoText_delete_all');
		}
	},

	'change #createAutoTextType': function(e) {
		Session.set('createAutoTextType',$(e.currentTarget).val());
	}
});

Template.autoTextsTable.events({
	'click .autotext-delete': function(e) {
		AutoTexts.remove(this._id);
	}
});

Template.createAutoText.rendered = function() {
	initCharacterCounter(this.$('.text-character-count'),this.$('.text-character-counter'));
};