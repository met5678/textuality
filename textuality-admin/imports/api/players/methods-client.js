import { Meteor } from 'meteor/meteor';

import Players from './players';
import Events from 'api/events';
import InTexts from 'api/inTexts';
import Media from 'api/media';

Meteor.methods({
  'players.findOrJoin': phoneNumber => {
    let player = Players.findOne({
      event: Events.currentId(),
      phoneNumber
    });

    if (!player) {
      const alias = Meteor.call('aliases.checkout');
      const id = Players.insert({
        event: Events.currentId(),
        phoneNumber,
        status: 'new',
        alias
      });
      player = Players.findOne(id);
    }

    return player;
  },

  'players.update': player => {
    Players.update(player._id, { $set: player });
  },

  'players.postInTextUpdate': ({ playerId, inText, media }) => {
    const playerFields = {
      recent: new Date(),
      feedTextsSent: InTexts.find({
        event: Events.currentId(),
        player: playerId,
        purpose: 'feed'
      }).count(),
      feedMediaSent: Media.find({
        event: Events.currentId(),
        player: playerId,
        purpose: 'feed'
      }).count()
    };

    Players.update(playerId, { $set: playerFields });
    // Meteor.call('achievements.checkForPlayer', player);
  }
});
