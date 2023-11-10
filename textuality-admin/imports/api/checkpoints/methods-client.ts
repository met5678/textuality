import { Meteor } from 'meteor/meteor';

import Checkpoints from './checkpoints';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import getCheckpointLocationStats from './process-checkpoint/get-location-stats';
import getCheckpointGroupStats from './process-checkpoint/get-group-stats';
import { group } from 'console';

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

    const locationStats = getCheckpointLocationStats({
      player,
      location: checkpoint.location,
    });

    const templateVars = {
      location: checkpoint.location,
      money_award: checkpoint.money_award,
      ...locationStats,
    };

    let gotAchievement = Meteor.call('achievements.tryUnlock', {
      trigger: 'CHECKPOINT_GROUP_FOUND_N',
      trigger_detail_string: checkpoint.location,
      trigger_detail_number: locationStats.numFound,
      playerId: player._id,
      templateVars,
    });

    if (locationStats.complete) {
      gotAchievement ||= Meteor.call('achievements.tryUnlock', {
        trigger: 'CHECKPOINT_LOCATION_COMPLETE',
        trigger_detail_string: checkpoint.location,
        playerId: player._id,
        templateVars,
      });
    }

    const groupStats = checkpoint.groups.map((group) =>
      getCheckpointGroupStats({ player, group }),
    );

    groupStats.forEach((groupStat) => {
      console.log(groupStat);
      gotAchievement ||= Meteor.call('achievements.tryUnlock', {
        trigger: 'CHECKPOINT_GROUP_FOUND_N',
        trigger_detail_string: groupStat.group,
        trigger_detail_number: groupStat.numFound,
        playerId: player._id,
        templateVars,
      });

      if (groupStat.complete) {
        gotAchievement ||= Meteor.call('achievements.tryUnlock', {
          trigger: 'CHECKPOINT_GROUP_COMPLETE',
          trigger_detail_string: groupStat.group,
          playerId: player._id,
          templateVars,
        });
      }
    });

    if (!gotAchievement) {
      if (checkpoint.player_text) {
        Meteor.call('autoTexts.sendCustom', {
          playerText: checkpoint.player_text,
          playerId,
          templateVars,
        });
      } else {
        if (checkpoint.suppress_autotext) {
          Meteor.call('autoTexts.send', {
            trigger: 'CHECKPOINT_FOUND_HIDDEN',
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
    }
  },
});
