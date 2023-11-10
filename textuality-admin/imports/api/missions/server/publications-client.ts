import { Meteor } from 'meteor/meteor';

import Missions from '..';
import Events from '/imports/api/events';

Meteor.publish('missions.basic', function () {
  this.autorun(() =>
    Missions.find(
      { event: Events.currentId()! },
      {
        fields: {
          event: 1,
          name: 1,
          timePreText: 1,
          timeStart: 1,
          timeEnd: 1,
        },
      },
    ),
  );
});

Meteor.publish('missions.active', function () {
  this.autorun(() =>
    Missions.find(
      { event: Events.currentId()!, active: true },
      {
        fields: {
          event: 1,
          name: 1,
          active: 1,
          timePreText: 1,
          timeStart: 1,
          timeEnd: 1,
        },
      },
    ),
  );
});
