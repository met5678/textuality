import { Meteor } from 'meteor/meteor';

import Guesses from '../';
import Events from 'api/events';

Meteor.publish('guesses.all', function () {
  this.autorun(() => Guesses.find({ event: Events.currentId() }));
});
