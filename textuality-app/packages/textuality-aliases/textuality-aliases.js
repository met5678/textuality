// Write your package code here!
Aliases = new Meteor.Collection('aliases');

Aliases.allow({
	insert: function(userId, doc) {
		return Roles.userIsInRole(userId,'admin');
	},
	remove: function(userId, doc) {
		return Roles.userIsInRole(userId,'admin');
	}
});

if(Meteor.isServer)
	Aliases._ensureIndex({ random: "2d"});

Meteor.methods({
	alias_getNew: function() {

	},
	alias_release: function(alias) {

	},
	
	alias_resetAll: function() {
		Aliases.update({},{$set: {used: false}}, {multi: true})
	},
	alias_deleteAll: function() {
		Aliases.remove({});
	}
})