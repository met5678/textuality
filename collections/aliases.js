Aliases = new Meteor.Collection('aliases');
if(Meteor.isServer) {
	Aliases._ensureIndex({ random : "2d" });
}

Meteor.methods({
	alias_getNew: function() {
		var alias = Aliases.findOne({ used:false, random: { $near: [Math.random(),0] } });
		Aliases.update(alias, { used:true });
		return alias._id;
	},
	alias_release: function(alias) {
		Aliases.update(alias, { used:false });
	},

	alias_resetall: function() {
		Aliases.update({},{$set: {used: false}}, {multi: true});
	},

	alias_deleteall: function() {
		Aliases.remove({});
	}
});