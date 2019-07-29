import { Meteor } from 'meteor/meteor';

import Players from './players';
import Events from 'api/events';

Meteor.methods({
  'players.getForMessage': message => {
    let player = Players.findOne({
      event: Events.currentId(),
      phone_number: message.from
    });
    if (!player) {
      const id = Players.insert({
        event: Events.currentId(),
        phone_number: message.from,
        alias: 'Test_alias'
      });
      player = Players.findOne(id);
    }

    return player;
  }
});
