import { Meteor } from 'meteor/meteor';

import Clues from '../';
import Events from 'api/events';

Meteor.publish('clues.basic', function () {
  this.autorun(() =>
    Clues.find(
      { event: Events.currentId() },
      {
        fields: {
          event: 1,
          name: 1,
          type: 1,
        },
      }
    )
  );
});
