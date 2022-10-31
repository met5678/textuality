import { Meteor } from 'meteor/meteor';

import AutoTexts from '../';
import Events from 'api/events';

Meteor.publish('autoTexts.all', function() {
  this.autorun(() => AutoTexts.find({ event: Events.current()._id }));
});
