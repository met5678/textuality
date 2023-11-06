import { Meteor } from 'meteor/meteor';

import Checkpoints from '..';
import Events from '/imports/api/events';

Meteor.publish('checkpoints.all', function () {
  this.autorun(() => Checkpoints.find({ event: Events.currentId()! }));
});
