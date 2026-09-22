import { Meteor } from 'meteor/meteor';

import Horses from '../horses';
import Events from '/imports/api/events';

Meteor.publish('derby.horses.all', function () {
  this.autorun(() => Horses.find({ event: Events.currentId() }));
});

Meteor.publish('derby.horses.basic', function () {
  this.autorun(() =>
    Horses.find(
      { event: Events.currentId() },
      {
        fields: {
          event: 1,
          name: 1,
          short_name: 1,
          number: 1,
          color: 1,
        },
      },
    ),
  );
});
