var resetForm = function(formEl) {
	formEl.find('input[type=text]').focus().val('');
	formEl.find('input[type=color]').focus().val('#FF0000');
	formEl.find('.badge-preview i').removeClass();
};

Template.createBadge.rendered = function() {
	initCharacterCounter(this.$('.text-character-count'),this.$('.text-character-counter'));
};

Template.createBadge.events({
	'submit .create-badge-form':function(e) {
		e.preventDefault();

		var formEl = $(e.currentTarget);
		var formValues = formEl.serializeArray();

		var badge = {
			"name":_.findWhere(formValues,{name:"name"}).value,
			"icon":_.findWhere(formValues,{name:"icon"}).value,
			"color":_.findWhere(formValues,{name:"color"}).value,
			"awarded":0,
			"type":"manual"
		};
		
		Badges.insert(badge);

		resetForm(formEl);
	},

	'change .create-badge-form':function(e) {
		var formEl = $(e.currentTarget);
		var badgeEl = formEl.find('.badge-preview i');
		var icon = _.findWhere(formEl.serializeArray(),{name:"icon"}).value;
		var color = _.findWhere(formEl.serializeArray(),{name:"color"}).value;
		badgeEl.removeClass().addClass("fa "+icon).css("color",color);
	},

	'click .create-badge-clear':function(e) {
		resetForm($(e.currentTarget).parents('form'));
	}
})