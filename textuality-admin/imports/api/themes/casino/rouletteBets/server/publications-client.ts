import { Meteor } from 'meteor/meteor';

import RouletteBets from '../';
import Events from '/imports/api/events';

Meteor.publish('rouletteBets.forRoulette', function (roulette_id) {
  this.autorun(() =>
    RouletteBets.find(
      { event: Events.currentId()!, roulette_id },
      { sort: { time: -1 } },
    ),
  );
});

Meteor.publish('rouletteBets.winnersForRoulette', function (roulette_id) {
  this.autorun(() =>
    RouletteBets.find(
      { event: Events.currentId()!, roulette_id, win_payout: { $gt: 0 } },
      { sort: { win_payout: -1 } },
    ),
  );
});
