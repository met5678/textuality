import { Meteor } from 'meteor/meteor';

import Horses from '../horses';
import Events from '/imports/api/events';

Meteor.publish('horses.all', function () {
  this.autorun(() => Horses.find({ event: Events.currentId()! }));
});
