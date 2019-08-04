import { Meteor } from 'meteor/meteor';

import InTexts from '../';
import Events from 'api/events';

Meteor.publish('inTexts.all', function() {
  this.autorun(() => InTexts.find({ event: Events.current()._id }));
});
