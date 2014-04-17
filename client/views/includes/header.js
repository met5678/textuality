Template.adminHeader.helpers({
	isPage: function(pageName) {
		if(Router.current() && Router.current().route.name == pageName) {
			return 'active';
		}
		return '';
	}
});