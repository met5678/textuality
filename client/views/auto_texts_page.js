Template.autoTextsTable.helpers({
	autoTexts: function() {
		return AutoTexts.find();
	}
});

Template.autoTextsPage.events({
	'submit form.autotext-add-form': function(e) {
		e.preventDefault();
		
		var autoText = {
			type: $(e.target).find('[name=type]').val(),
			destination: $(e.target).find('[name=destination]:checked').val(),
			body: $(e.target).find('[name=text]').val(),
			random:[Math.random(),0]
		};

		try {
			autoText.number = parseInt($(e.target).find('[name=number]').val());
		} catch(e) {}

		if(typeof autoText.number == 'number' && _.isNaN(autoText.number)) {
			delete autoText.number;
		}
		
		AutoTexts.insert(autoText);

		$(e.target).find('input[type=text]').val('');
		$(e.target).find('textarea').val('');
	},

	'click .autotexts-deleteall-btn': function(e) {
		if(confirm("Delete all autotexts: Are you sure?")) {
			Meteor.call('autoText_delete_all');
		}
	}
});

Template.autoTextsTable.events({
	'click .autotext-delete': function(e) {
		var autoText = $(e.currentTarget).parents('tr').data('id');
		AutoTexts.remove(autoText);
	}
});