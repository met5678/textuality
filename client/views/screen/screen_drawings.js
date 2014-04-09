var checkTime = 5000;
var pixelBuffer = 1000;

Template.screenDrawings.rendered = function() {
	var caveDrawingShell = $('.cave-drawings');
	var caveDrawingFaces = $('.cave-drawings-src').children();

	var getRandomDrawing = function() {
		var rand = Math.floor(caveDrawingFaces.length*Math.random());
		return caveDrawingFaces.eq(rand);
	};

	var shellHeight = caveDrawingShell.height();
	var height = $(window).height();
	
	caveDrawingShell.css('top',(height-shellHeight-300)+'px')
};