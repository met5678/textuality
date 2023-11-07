import { Meteor } from 'meteor/meteor';

import Checkpoints from './checkpoints';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import checkLocationForPlayer from './process-checkpoint/get-location-stats';
import checkGroupsForPlayer from './process-checkpoint/check-groups';

Meteor.methods({
  'checkpoints.getForHashtag': (hashtag) => {
    const checkpointQuery = { event: Events.currentId()!, hashtag };

    const checkpoint = Checkpoints.findOne(checkpointQuery);
    if (!checkpoint) {
      return null;
    }

    return checkpoint;
  },

  'checkpoints.awardToPlayer': ({ playerId, checkpointId }) => {
    const player = Players.findOne(playerId);
    const checkpoint = Checkpoints.findOne(checkpointId);

    if (!player || !checkpoint) {
      return;
    }

    Checkpoints.update(checkpointId, { $inc: { num_checkins: 1 } });

    const playerCheckpoints = player.checkpoints;
    playerCheckpoints.push({
      id: checkpoint._id!,
      location: checkpoint.location,
      hashtag: checkpoint.hashtag,
      time: new Date(),
    });

    Meteor.call('players.setCheckpoints', {
      playerId,
      checkpoints: playerCheckpoints,
    });

    Meteor.call('players.giveMoney', {
      playerId,
      money: checkpoint.money_award,
    });

    const locationStats = checkLocationForPlayer({
      player,
      location: checkpoint.location,
    });
    const foundGroup = checkpoint.groups.some((group) =>
      checkGroupsForPlayer({ player, group }),
    );

    const templateVars = {
      location: checkpoint.location,
      money_award: checkpoint.money_award,
      ...locationStats,
    };

    if (locationStats.complete) {
      Meteor.call('achievements.tryUnlock', {
        trigger: 'CHECKPOINT_LOCATION',
        triggerDetail: checkpoint.location,
        playerId: player._id,
        templateVars,
      });
      return true;
    }

    if (!locationStats.complete && !foundGroup) {
      if (checkpoint.playerText) {
        Meteor.call('autoTexts.sendCustom', {
          playerText: checkpoint.playerText,
          playerId,
          templateVars,
        });
      } else {
        Meteor.call('autoTexts.send', {
          trigger: 'CHECKPOINT_FOUND',
          playerId,
          templateVars,
        });
      }
    }
  },
});
