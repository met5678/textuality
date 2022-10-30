import { Meteor } from 'meteor/meteor';

import Players from '../';
import Events from 'api/events';

Meteor.publish('players.all', function() {
  this.autorun(() => Players.find({ event: Events.current()._id }));
});

Meteor.publish('players.basic', function() {
  this.autorun(() =>
    Players.find(
      { event: Events.current()._id },
      {
        fields: {
          event: 1,
          phoneNumber: 1,
          alias: 1,
          status: 1,
          textsSent: 1
        }
      }
    )
  );
});
