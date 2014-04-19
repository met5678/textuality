window.initCharacterCounter = function(sourceEl,counterEl) {
	var maxLength = sourceEl.data('maxLength');
	sourceEl.on('keypress keyup',function(e) {
		var remaining = maxLength-sourceEl.val().length;
		counterEl.html(remaining);
		if(remaining > 5) {
			counterEl.removeClass('text-danger text-warning');
		}
		else if(remaining > 0) {
			counterEl.removeClass('text-danger').addClass('text-warning');
		}
		else if(remaining <= 0) {
			sourceEl.val(sourceEl.val().substring(0,maxLength));
			counterEl.html(0);
			counterEl.removeClass('text-warning').addClass('text-danger');
		}
	});
};