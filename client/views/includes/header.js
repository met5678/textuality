Template.header.helpers({
	isPage: function(pageName) {
		if(Router.current() && Router.current().path == pageName) {
			return 'active';
		}
		return '';
	}
});