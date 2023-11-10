import { Meteor } from 'meteor/meteor';

import Players from '..';
import Events from '/imports/api/events';

Meteor.publish('players.basic', function () {
  this.autorun(() =>
    Players.find(
      { event: Events.currentId()!, status: 'active' },
      {
        fields: {
          event: 1,
          alias: 1,
          avatar: 1,
          money: 1,
        },
      },
    ),
  );
});
