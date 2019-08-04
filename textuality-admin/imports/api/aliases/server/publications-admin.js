import { Meteor } from 'meteor/meteor';

import Aliases from '../';
import Events from 'api/events';

Meteor.publish('aliases.all', function() {
  this.autorun(() => Aliases.find({ event: Events.currentId() }));
});
