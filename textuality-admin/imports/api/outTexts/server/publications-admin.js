import { Meteor } from 'meteor/meteor';

import OutTexts from '../';
import Events from 'api/events';
import getPaginatedCursor from '../../_utils/publish-paginated';

Meteor.publish('outTexts.all', function () {
  this.autorun(() =>
    OutTexts.find(
      { event: Events.currentId() },
      { sort: { time: -1 }, limit: 100 },
    ),
  );
});

Meteor.publish(
  'outTexts.paged',
  getPaginatedCursor(OutTexts, {
    getServerQuery: () => ({
      event: Events.currentId(),
    }),
  }),
);
