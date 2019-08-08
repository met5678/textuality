import { Meteor } from 'meteor/meteor';

import Achievements from '../';
import Events from 'api/events';

Meteor.publish('achievements.basic', function() {
  this.autorun(() =>
    Achievements.find(
      { event: Events.current()._id },
      {
        fields: {
          event: 1,
          name: 1,
          hideFromScreen: 1
        }
      }
    )
  );
});
