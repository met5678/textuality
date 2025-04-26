import { Meteor } from 'meteor/meteor';

import RaceBets from '../raceBets';
import Events from '/imports/api/events';
import Tellers from '/imports/api/themes/derby/tellers';

// Intended for use with a teller screen
Meteor.publish('derby.raceBets.forTeller', function (tellerId: string) {
  this.autorun(() => {
    const teller = Tellers.findOne({ _id: tellerId });
    if (!teller || !teller.current_bet) return this.ready();
    return RaceBets.find(teller.current_bet);
  });
});

// Intended for use on tote board screens
Meteor.publish('derby.raceBets.recent', function () {
  this.autorun(() =>
    RaceBets.find(
      { event: Events.currentId() },
      { sort: { createdAt: -1 }, limit: 10 },
    ),
  );
});
