import { Meteor } from 'meteor/meteor';

import Fortunes from '../fortunes';
import Events from '/imports/api/events';

// Intended for use on tote board screens
Meteor.publish('derby.fortunes.recent', function () {
  this.autorun(() =>
    Fortunes.find(
      { event: Events.currentId() },
      { sort: { createdAt: -1 }, limit: 10 },
    ),
  );
});
