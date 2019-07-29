import { Meteor } from 'meteor/meteor';

import InTexts from '../';

Meteor.publish('inTexts.feed', function() {
  this.autorun(() => {
    const eventId = Events.currentId();
    if (eventId) {
      return InTexts.find(
        { event: eventId, purpose: 'feed' },
        { limit: 30, sort: { time: -1 } }
      );
    } else {
      return this.ready();
    }
  });
});
