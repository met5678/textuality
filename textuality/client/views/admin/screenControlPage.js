Template.adminScreenControl.helpers({
	screenSettings: function() {
		return ScreenSettings.find({},{sort:{order:1}});
	}
})

Template.screenControlItem.helpers({
	isType: function(type) {
		return this.dataType == type;
	},

	itemId: function(type) {
		return this._id;
	},

	isChecked: function() {
		if(this.value)
			return "checked";
	},

	isSelected: function(value) {
		if(this.value == value)
			return "checked";
	}
});

Template.screenControlItem.events({
	'submit form': function(e) {
		e.preventDefault();
		var formEl = $(e.currentTarget);
		ScreenSettings.update(this._id,{$set:{value:formEl.find('[name='+this._id+']').val()}});

	},

	'change input': function(e) {
		if(this.dataType == 'text')
			return;

		var inputEl = $(e.currentTarget);
		var id = inputEl.attr('name');
		var value = inputEl.val();

		if(this.dataType == 'boolean')
			value = inputEl.prop('checked');

		ScreenSettings.update(id,{$set:{value:value}});
	}
});