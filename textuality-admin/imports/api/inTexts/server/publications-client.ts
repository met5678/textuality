import { Meteor } from 'meteor/meteor';

import Events from '/imports/api/events';
import InTexts from '..';

Meteor.publish('inTexts.feed', function (n) {
  this.autorun(() => {
    const eventId = Events.currentId();
    if (eventId) {
      return InTexts.find(
        { event: eventId, purpose: 'feed' },
        { limit: n, sort: { time: -1 } },
      );
    } else {
      return this.ready();
    }
  });
});
