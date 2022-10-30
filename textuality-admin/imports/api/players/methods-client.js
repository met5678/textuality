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

  'players.updateAfterInText': inText => {
    const player = Players.findOne(inText.player);

    const playerFields = {
      recent: new Date(),
      feedTextsSent: InTexts.find({
        event: Events.currentId(),
        player: inText.player,
        purpose: 'feed'
      }).count(),
      feedMediaSent: Media.find({
        event: Events.currentId(),
        player: inText.player,
        purpose: 'feed'
      }).count()
    };

    if (
      player.status === 'quit' &&
      !(inText.body && inText.body.startsWith('/leave'))
    ) {
      playerFields.status = 'active';
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'SIGN_BACK_ON'
      });
    }

    Players.update(inText.player, { $set: playerFields });
  },

  'players.setStatus': ({ playerId, status }) => {
    Players.update(playerId, { $set: { status } });
  },

  'players.setAlias': ({ playerId, alias }) => {
    const player = Players.findOne(playerId);

    const oldAliases = [player.alias, ...player.oldAliases];

    Players.update(playerId, { $set: { alias, oldAliases } });
  },

  'players.setAvatar': ({ playerId, avatar }) => {
    Players.update(playerId, { $set: { avatar } });
  },

  'players.setCheckpoints': ({ playerId, checkpoints }) => {
    Players.update(playerId, { $set: { checkpoints } });
  }
});
