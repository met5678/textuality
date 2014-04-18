Meteor.startup(function() {
	if(!Meteor.users.find().fetch().length) {
		var id = Accounts.createUser({
			username: 'txtadmin',
			password: "tilda234",
			profile: { name: 'Textuality Admin' }
		});
		Roles.addUsersToRoles(id, 'admin');
	}
});