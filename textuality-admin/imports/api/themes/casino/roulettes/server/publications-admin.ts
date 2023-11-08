import { Meteor } from 'meteor/meteor';

import Roulettes from '../roulettes';
import Events from '/imports/api/events';

Meteor.publish('roulettes.all', function () {
  this.autorun(() => Roulettes.find({ event: Events.currentId()! }));
});
