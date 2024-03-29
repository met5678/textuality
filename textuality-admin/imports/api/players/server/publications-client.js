import { Meteor } from 'meteor/meteor';

import Players from '../';
import Events from 'api/events';

Meteor.publish('players.basic', function() {
  this.autorun(() =>
    Players.find(
      { event: Events.currentId() },
      {
        fields: {
          event: 1,
          alias: 1,
          feedTextsSent: 1,
          checkpoints: 1,
          numAchievements: 1
        }
      }
    )
  );
});
