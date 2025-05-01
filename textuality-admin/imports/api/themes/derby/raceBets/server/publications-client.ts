import { Meteor } from 'meteor/meteor';

import RaceBets from '../raceBets';
import Events from '/imports/api/events';
import Tellers from '/imports/api/themes/derby/tellers';

// Intended for use with a teller screen
Meteor.publish('derby.raceBets.forTeller', function (tellerId: string) {
  this.autorun(() => {
    const tellers = Tellers.find(tellerId, {
      fields: { current_bet: 1 },
    }).fetch();
    if (!tellers || !tellers.length) return this.ready();

    const teller = tellers[0];
    if (!teller.current_bet) return this.ready();
    console.log('publishing derby.raceBets.forTeller', teller);
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
