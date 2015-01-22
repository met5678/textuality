Template.adminLogin.events({
	'submit #adminLoginForm':function(e,t) {
		e.preventDefault();

		var username = $('#loginUser').val(),
			password = $('#loginPassword').val();

		Meteor.loginWithPassword(username,password,function(err) {
			if(err) {
				$('#loginError').html(err.reason);
			}
			else
				Router.go('adminTexts');
		});
	}
});