import { Meteor } from 'meteor/meteor';

import AutoTexts from '..';
import Events from '/imports/api/events';

Meteor.publish('autoTexts.all', function () {
  this.autorun(() => AutoTexts.find({ event: Events.currentId()! }));
});
