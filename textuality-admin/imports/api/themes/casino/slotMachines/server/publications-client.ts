import { Meteor } from 'meteor/meteor';

import SlotMachines from '../slotMachines';
import Events from '/imports/api/events';

Meteor.publish('slotMachines.forCode', function (code) {
  this.autorun(() =>
    SlotMachines.find(
      { event: Events.currentId()!, code },
      {
        limit: 1,
        fields: {
          name: 1,
          cost: 1,
          status: 1,
          result: 1,
          win_amount: 1,
          player: 1,
          player_queue: 1,
          stats: 1,
        },
      },
    ),
  );
});
