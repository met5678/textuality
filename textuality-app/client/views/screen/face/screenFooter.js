Template.screenFooter.helpers({
	faceCrops: function() {
		return InTexts.find({
			"purpose.type":"faceCrops"
		},{
			sort: { time: -1 }
		});
	}
});