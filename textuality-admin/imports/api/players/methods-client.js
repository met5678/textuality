import { Meteor } from 'meteor/meteor';

import Players from './players';
import Events from 'api/events';

Meteor.methods({
  'players.getForMessage': message => {
    let player = Players.findOne({
      event: Events.currentId(),
      phone_number: message.from
    });
    let isNew = false;
    if (!player) {
      isNew = true;
      const alias = Meteor.call('aliases.checkout');
      const id = Players.insert({
        event: Events.currentId(),
        phone_number: message.from,
        alias
      });
      player = Players.findOne(id);
    }

    return { player, isNew };
  },

  'players.changeAlias': ({ player }) => {},

  'players.changeAvatar': ({ player, inText }) => {},

  'players.processAvatar': ({ player, inText }) => {}
});
