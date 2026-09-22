import { Meteor } from 'meteor/meteor';

import Fortunes from '../fortunes';
import Events from '/imports/api/events';
import { PlayerId } from '/imports/schemas/player';
import { TellerId } from '/imports/schemas/derby/teller';
import getPaginatedCursor from '/imports/api/_utils/publish-paginated';

Meteor.publish('derby.fortunes.all', function () {
  this.autorun(() => Fortunes.find({ event: Events.currentId() }));
});

Meteor.publish(
  'derby.fortunes.paged',
  getPaginatedCursor(Fortunes, {
    getServerQuery: () => ({
      event: Events.currentId(),
    }),
  }),
);

Meteor.publish('derby.fortunes.forPlayer', function (playerId: PlayerId) {
  this.autorun(() =>
    Fortunes.find({ event: Events.currentId(), player: playerId }),
  );
});

Meteor.publish('derby.fortunes.forTeller', function (tellerId: TellerId) {
  this.autorun(() =>
    Fortunes.find({ event: Events.currentId(), teller: tellerId }),
  );
});
