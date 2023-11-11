import { Meteor } from 'meteor/meteor';

import OutTexts from '../';
import Events from 'api/events';

Meteor.publish('outTexts.all', function () {
  this.autorun(() =>
    OutTexts.find(
      { event: Events.current()._id },
      { sort: { time: -1 }, limit: 100 },
    ),
  );
});
