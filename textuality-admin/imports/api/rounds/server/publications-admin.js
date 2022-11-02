import { Meteor } from 'meteor/meteor';

import Rounds from '../';
import Events from 'api/events';

Meteor.publish('rounds.all', function () {
  this.autorun(() => Rounds.find({ event: Events.current()._id }));
});

Meteor.publish('rounds.basic', function () {
  this.autorun(() =>
    Rounds.find(
      { event: Events.current()._id },
      {
        fields: {
          event: 1,
          name: 1,
          hideFromScreen: 1,
        },
      }
    )
  );
});
