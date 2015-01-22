/*
Badges
{
	_id:
	name:"Lightning Texter"
	icon:"fa-rocket"
	color:"#F12B34"
	type:"auto/manual"
}
*/

Badges = new Meteor.Collection('badges');

Badges.allow({
	insert: function(userId, doc) {
		return Roles.userIsInRole(userId,'admin');
	},
	remove: function(userId, doc) {
		return Roles.userIsInRole(userId,'admin');
	}
});