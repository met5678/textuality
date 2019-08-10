import { Meteor } from 'meteor/meteor';

import Achievements from '../';
import Events from 'api/events';

Meteor.publish('achievements.basic', function() {
  this.autorun(() =>
    Achievements.find(
      { event: Events.currentId() },
      {
        fields: {
          event: 1,
          name: 1,
          hideFromScreen: 1,
          earned: 1
        }
      }
    )
  );
});
