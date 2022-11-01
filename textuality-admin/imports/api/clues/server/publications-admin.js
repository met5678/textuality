import { Meteor } from 'meteor/meteor';

import Clues from '../';
import Events from 'api/events';

Meteor.publish('clues.all', function () {
  this.autorun(() => Clues.find({ event: Events.current()._id }));
});

Meteor.publish('clues.basic', function () {
  this.autorun(() =>
    Clues.find(
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
