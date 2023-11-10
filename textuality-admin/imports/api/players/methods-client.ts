import { Meteor } from 'meteor/meteor';

import Players from './players';
import Events from '/imports/api/events';
import InTexts from '/imports/api/inTexts';
import Media from '/imports/api/media';
import PlayerSchema, { Player } from '/imports/schemas/player';

Meteor.methods({
  'players.findOrJoin': (phoneNumber) => {
    let player = Players.findOne({
      event: Events.currentId()!,
      phoneNumber,
    });

    if (!player) {
      const alias = Meteor.call('aliases.checkout');
      const id = Players.insert({
        event: Events.currentId()!,
        phoneNumber,
        joined: new Date(),
        recent: new Date(),
        status: 'new',
        alias,
        oldAliases: [],
        isAdmin: false,
        checkpoints: [],
        money: 0,
        numAchievements: 0,
        slot_spins: [],
        quests: [],
      });
      player = Players.findOne(id);
    }

    return player;
  },

  'players.updateAfterInText': (inText) => {
    const player = Players.findOne(inText.player);

    if (!player) return;

    const playerFields: Partial<Player> = {
      recent: new Date(),
      // feedTextsSent: InTexts.find({
      //   event: Events.currentId()!,
      //   player: inText.player,
      //   purpose: 'feed',
      // }).count(),
      // feedMediaSent: Media.find({
      //   event: Events.currentId()!,
      //   player: inText.player,
      //   purpose: 'feed',
      // }).count(),
      // status: player.status,
    };

    if (
      player.status === 'quit' &&
      !(inText.body && inText.body.startsWith('/leave'))
    ) {
      playerFields.status = 'active';
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'SIGN_BACK_ON',
      });
    }

    Players.update(inText.player, { $set: playerFields });
  },

  'players.setStatus': ({ playerId, status }) => {
    Players.update(playerId, { $set: { status } });
  },

  'players.setAlias': ({ playerId, alias }) => {
    const player = Players.findOne(playerId);
    if (!player) return;

    const oldAliases = [player.alias, ...player.oldAliases];

    Players.update(playerId, { $set: { alias, oldAliases } });
  },

  'players.setAvatar': ({ playerId, avatar }) => {
    Players.update(playerId, { $set: { avatar } });
  },

  'players.setCheckpoints': ({ playerId, checkpoints }) => {
    Players.update(playerId, { $set: { checkpoints } });
  },

  'players.giveMoney': ({ playerId, money }) => {
    Players.update(playerId, { $inc: { money } });
  },

  'players.takeMoney': ({ playerId, money }) => {
    const player = Players.findOne(playerId);
    if (!player) return;
    if (money > player.money) {
      Players.update(playerId, { $set: { money: 0 } });
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'BANKRUPT',
      });
    } else {
      Players.update(playerId, { $inc: { money: -money } });
    }
  },

  'players.recordSlotSpin': ({ player_id, slot_id, win_amount }) => {
    Players.update(player_id, {
      $push: {
        slot_spins: {
          slot_id,
          win_amount,
          time_spun: new Date(),
        },
      },
    });
  },
});
