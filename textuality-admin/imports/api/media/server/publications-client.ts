import { Meteor } from 'meteor/meteor';

import Media from '..';
import Events from '/imports/api/events';

Meteor.publish('media.feed', function (n) {
  this.autorun(() =>
    Media.find(
      { event: Events.currentId()!, purpose: 'feed' },
      { sort: { time: -1 }, limit: n },
    ),
  );
});
