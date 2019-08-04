import { Meteor } from 'meteor/meteor';

import Media from '../';
import Events from 'api/events';

Meteor.publish('media.all', function() {
  this.autorun(() => Media.find({ event: Events.current()._id }));
});
