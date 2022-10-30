import { Meteor } from 'meteor/meteor';

import Missions from '../';
import Events from 'api/events';

Meteor.publish('missions.all', function() {
  this.autorun(() => Missions.find({ event: Events.current()._id }));
});
