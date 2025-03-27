import { Meteor } from 'meteor/meteor';

import Horses from '../horses';
import Events from '/imports/api/events';

Meteor.publish('horses.forCode', function (code) {
  this.autorun(() =>
    Horses.find(
      { event: Events.currentId()! },
      {
        fields: {
          name: 1,
          short_name: 1,
          color: 1,
          stats: 1,
        },
      },
    ),
  );
});
