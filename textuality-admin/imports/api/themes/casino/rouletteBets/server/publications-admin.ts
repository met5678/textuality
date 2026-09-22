import { Meteor } from 'meteor/meteor';

import RouletteBets from '..';
import Events from '/imports/api/events';
import getPaginatedCursor from '/imports/api/_utils/publish-paginated';

Meteor.publish('rouletteBets.all', function () {
  this.autorun(() => RouletteBets.find({ event: Events.currentId()! }));
});

Meteor.publish(
  'rouletteBets.paged',
  getPaginatedCursor(RouletteBets, {
    getServerQuery: () => ({
      event: Events.currentId(),
    }),
  }),
);

Meteor.publish('rouletteBets.forRoulette', function (roulette_id) {
  this.autorun(() =>
    RouletteBets.find({ event: Events.currentId()!, roulette_id }),
  );
});
