import { Meteor } from 'meteor/meteor';

import Missions from '..';
import Events from '/imports/api/events';

Meteor.publish('missions.all', function () {
  this.autorun(() => Missions.find({ event: Events.currentId()! }));
});
