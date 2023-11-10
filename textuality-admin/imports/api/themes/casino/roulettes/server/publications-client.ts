import { Meteor } from 'meteor/meteor';

import Roulettes from '../roulettes';
import Events from '/imports/api/events';
import reactiveDate from '/imports/utils/reactive-date';

Meteor.publish('roulettes.currentOrNext', function () {
  this.autorun(() => {
    const now = reactiveDate.get();
    return Roulettes.find(
      {
        event: Events.currentId()!,
        $or: [
          { status: { $ne: 'inactive' } },
          { scheduled: true, bets_start_at: { $gt: now } },
        ],
      },
      {
        sort: { bets_start_at: 1 },
        limit: 1,
        fields: {
          number_payout_multiplier: 1,
          special_payout_multiplier: 1,
          bets_start_at: 1,
          spin_starts_at: 1,
          spin_seconds: 1,
          bets_cutoff_seconds: 1,

          bets_open: 1,
          result: 1,
          status: 1,
        },
      },
    );
  });
});
