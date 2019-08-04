import { Meteor } from 'meteor/meteor';

import Players from './players';
import Events from 'api/events';

Meteor.methods({
  'players.findOrJoin': phone_number => {
    let player = Players.findOne({
      event: Events.currentId(),
      phone_number
    });

    if (!player) {
      const alias = Meteor.call('aliases.checkout');
      const id = Players.insert({
        event: Events.currentId(),
        phone_number,
        status: 'new',
        alias
      });
      player = Players.findOne(id);
    }

    return player;
  },

  'players.update': player => {
    Players.update(player._id, { $set: player });
  }
});
