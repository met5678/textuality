Template.aliasesPage.helpers({
	aliasesUsed: function() {
		return Aliases.find( { 'used':true }).count();
	},

	aliasesRemaining: function() {
		return Aliases.find( { 'used':false }).count();
	}
});

Template.aliasesList.helpers({
	aliases: function() {
		return Aliases.find({}, {sort: {_id:1}});
	},

	aliasClass: function() {
		if(this.used) {
			return 'label-success';
		}
		return '';
	}
});


Template.aliasesPage.events({
	'submit form.alias-add-form': function(e) {
		e.preventDefault();
		
		var alias = $(e.target).find('.alias-add-text').val();
		
		Aliases.insert( { _id:alias, used:false, random:[Math.random(),0] });

		$(e.target).find('.alias-add-text').focus().val('');
	},

	'click .alias-deleteall-btn': function(e) {
		if(confim("Delete All Aliases: Are you sure?"))
			Meteor.call('alias_deleteall');
	},

	'click .alias-resetall-btn': function(e) {
		if(confim("Reset All Aliases: Are you sure?"))
			Meteor.call('alias_resetall');
	},

	'click .alias-delete': function(e) {
		var alias = $(e.currentTarget).parent().data('alias');
		Aliases.remove(alias);
	}
});