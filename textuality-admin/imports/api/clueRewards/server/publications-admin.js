import { Meteor } from 'meteor/meteor';

import ClueRewards from '../';
import Events from 'api/events';

Meteor.publish('clueRewards.all', function () {
  this.autorun(() => ClueRewards.find({ event: Events.current()._id }));
});
