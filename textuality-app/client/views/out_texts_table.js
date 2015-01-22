Template.outTextsTable.helpers({
	outTexts: function() {
		return OutTexts.find({},{sort: {time:-1}});
	}
});

Template.outTextRow.helpers({
	status: function() {
		if(this.status == 'sent') {
			return new Handlebars.SafeString('<span class="label label-success">Sent</span>');
		}
		else if(this.status == 'queued'){ 
			return new Handlebars.SafeString('<span class="label">Queued</span>');
		}
		else {
			return new Handlebars.SafeString('<span class="label label-error">'+this.status+'</span>');
		}
	},
	
	purpose: function() {
		if(this.purpose) {
			if(this.purpose.type == 'system') {
				return new Handlebars.SafeString('<span class="label">System</span><br />'+this.purpose.description);
			}
			else if(this.purpose.type == 'mission') {
				return new Handlebars.SafeString('<span class="label label-info">Feed</span>');
			}
			else if(this.purpose.type == 'manual') {
				return new Handlebars.SafeString('<span class="label label-success">Manual</span>');
			}
		}
		return '--';
	}
});