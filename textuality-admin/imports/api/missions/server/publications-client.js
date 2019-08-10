import { Meteor } from 'meteor/meteor';

import Missions from '../';
import Events from 'api/events';

Meteor.publish('missions.basic', function() {
  this.autorun(() =>
    Missions.find(
      { event: Events.current()._id },
      {
        fields: {
          event: 1,
          name: 1,
          timePreText: 1,
          timeStart: 1,
          timeEnd: 1
        }
      }
    )
  );
});

Meteor.publish('missions.active', function() {
  this.autorun(() =>
    Missions.find(
      { event: Events.current()._id, active: true },
      {
        fields: {
          event: 1,
          name: 1,
          active: 1,
          timePreText: 1,
          timeStart: 1,
          timeEnd: 1
        }
      }
    )
  );
});
