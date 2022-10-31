import { Meteor } from 'meteor/meteor';

import Checkpoints from '../';
import Events from 'api/events';

Meteor.publish('checkpoints.all', function() {
  this.autorun(() => Checkpoints.find({ event: Events.current()._id }));
});
