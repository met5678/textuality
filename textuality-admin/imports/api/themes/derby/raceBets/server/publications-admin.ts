import { Meteor } from 'meteor/meteor';

import RaceBets from '../raceBets';
import Events from '/imports/api/events';
import { RaceId } from '/imports/schemas/derby/race';
import { PlayerId } from '/imports/schemas/player';
import { TellerId } from '/imports/schemas/derby/teller';
import getPaginatedCursor from '/imports/api/_utils/publish-paginated';

Meteor.publish('derby.raceBets.all', function () {
  this.autorun(() => RaceBets.find({ event: Events.currentId() }));
});

Meteor.publish(
  'derby.raceBets.paged',
  getPaginatedCursor(RaceBets, {
    getServerQuery: () => ({
      event: Events.currentId(),
    }),
  }),
);

Meteor.publish('derby.raceBets.pending', function () {
  this.autorun(() =>
    RaceBets.find({ event: Events.currentId(), status: 'pending' }),
  );
});

Meteor.publish('derby.raceBets.forRace', function (raceId: RaceId) {
  this.autorun(() =>
    RaceBets.find({ event: Events.currentId(), race: raceId }),
  );
});

Meteor.publish('derby.raceBets.forPlayer', function (playerId: PlayerId) {
  this.autorun(() =>
    RaceBets.find({ event: Events.currentId(), player: playerId }),
  );
});

Meteor.publish('derby.raceBets.forTeller', function (tellerId: TellerId) {
  this.autorun(() =>
    RaceBets.find({ event: Events.currentId(), teller: tellerId }),
  );
});
