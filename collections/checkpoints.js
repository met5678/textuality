Checkpoints = new Meteor.Collection('checkpoints');

Meteor.methods({
	checkpoint_checkText: function(participant,inText) {
		var hashtagIndex = inText.body.indexOf('#');
		var spaceIndex = inText.body.indexOf(' ',hashtagIndex);
		if(hashtagIndex  >= inText.body.length-1) {
			return false;
		}
		if(spaceIndex == -1) {
			var hashtag = inText.body.substring(hashtagIndex+1).toLowerCase();
		}
		else {
			var hashtag = inText.body.substring(hashtagIndex+1,spaceIndex).toLowerCase();
		}

		var checkpoint = Checkpoints.findOne({_id:hashtag});
		if(checkpoint) {
			if(Meteor.call('participant_checkin',participant,checkpoint)) {
				Checkpoints.update(checkpoint._id,{$push:{checkins: participant._id}});
				Meteor.call('settings_ticker_update',participant.alias + " " + checkpoint.tickerText);
			}
			return true;
		}
		return false;
	},

	checkpoint_clearCheckins: function() {
		Checkpoints.update({},{$set:{checkins:[]}},{multi:true});
		Meteor.call('participant_clearAllCheckins');
	},

	checkpoint_numTotal: function() {
		return Checkpoints.find().count();
	}
});