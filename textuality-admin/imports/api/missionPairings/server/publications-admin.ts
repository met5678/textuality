import { Meteor } from 'meteor/meteor';

import MissionPairings from '..';
import Events from 'api/events';

Meteor.publish('missionPairings.all', function () {
  this.autorun(() => MissionPairings.find({ event: Events.currentId() }));
});
