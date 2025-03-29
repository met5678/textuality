import { Meteor } from 'meteor/meteor';

import Races from '../races';
import Events from '/imports/api/events';

Meteor.publish('races.all', function () {
  this.autorun(() => Races.find({ event: Events.currentId()! }));
});
