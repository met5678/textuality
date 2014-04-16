Template.adminTexts.helpers({
	totalInTexts: function() {
		return 0;
	},

	totalOutTexts: function() {
		return 0;
	},

	allTexts: function() {
		return InTexts.find();
	}
});