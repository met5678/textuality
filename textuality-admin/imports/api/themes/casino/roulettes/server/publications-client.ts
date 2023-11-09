import { Meteor } from 'meteor/meteor';

import SlotMachines from '../roulettes';
import Events from '/imports/api/events';

Meteor.publish('roulettes.current', function () {
  this.autorun(() =>
    SlotMachines.find(
      { event: Events.currentId()! },
      {
        fields: {
          minimum_bet: 1,
          bets_start_at: 1,
          spin_starts_at: 1,
          spin_ends_at: 1,
          spin_started_at: 1,
          bets_open: 1,
          spin_seconds: 1,
          bets_cutoff_seconds: 1,

          result: 1,
          status: 1,
        },
      },
    ),
  );
});
