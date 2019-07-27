import { Meteor } from 'meteor/meteor';

import Events from '../';

Meteor.publish('events.all', function() {
  return Events.find();
});

Meteor.publish('events.basic', function() {
  return Events.find();
});

Meteor.publish('events.current', function() {
  this.autorun(() => {
    const curEvent = Events.current();

    if (curEvent) {
      return Events.find(curSeason._id);
    } else {
      return this.ready();
    }
  });
});
