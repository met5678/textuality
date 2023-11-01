import { Meteor } from 'meteor/meteor';

import Events from '..';

Meteor.publish('events.current', function () {
  this.autorun(() => {
    const curEvent = Events.current();
    if (curEvent) {
      return Events.find(curEvent._id);
    } else {
      return this.ready();
    }
  });
});
