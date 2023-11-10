import { Meteor } from 'meteor/meteor';

import Quests from '../quests';
import Events from '/imports/api/events';

Meteor.publish('quests.all', function () {
  this.autorun(() => Quests.find({ event: Events.currentId()! }));
});
