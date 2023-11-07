import { Meteor } from 'meteor/meteor';

import Achievements from '..';
import Events from '/imports/api/events';

Meteor.publish('achievements.all', function () {
  this.autorun(() => Achievements.find({ event: Events.currentId()! }));
});

Meteor.publish('achievements.basic', function () {
  this.autorun(() =>
    Achievements.find(
      { event: Events.currentId()! },
      {
        fields: {
          event: 1,
          name: 1,
          hideFromScreen: 1,
        },
      },
    ),
  );
});
