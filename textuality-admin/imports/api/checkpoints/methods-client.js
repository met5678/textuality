import { Meteor } from 'meteor/meteor';

import Checkpoints from './checkpoints';
import Events from 'api/events';
import Players from 'api/players';

Meteor.methods({
  'checkpoints.getForHashtag': (hashtag) => {
    const checkpointQuery = { event: Events.currentId(), hashtag };

    const checkpoint = Checkpoints.findOne(checkpointQuery);
    if (!checkpoint) {
      return null;
    }

    return checkpoint;
  },

  'checkpoints.awardToPlayer': ({ playerId, checkpointId }) => {
    const player = Players.findOne(playerId);
    const checkpoint = Checkpoints.findOne(checkpointId);

    const playerCheckpoints = player.checkpoints;
    playerCheckpoints.push({
      checkpoint: checkpoint._id,
      group: checkpoint.group,
      hashtag: checkpoint.hashtag,
      time: new Date(),
    });

    Meteor.call('players.setCheckpoints', {
      playerId,
      checkpoints: playerCheckpoints,
    });

    const checkpointsInGroup = Checkpoints.find({
      event: Events.currentId(),
      group: checkpoint.group,
    }).fetch();
    const foundCheckpointsInGroup = checkpointsInGroup.filter((checkpoint) =>
      playerCheckpoints.some(
        (pCheckpoint) => pCheckpoint.checkpoint === checkpoint._id
      )
    );

    if (foundCheckpointsInGroup.length === checkpointsInGroup.length) {
      Meteor.call('achievements.tryUnlock', {
        trigger: 'CHECKPOINT_GROUP',
        triggerDetail: checkpoint.group,
        playerId,
      });
    } else {
      Meteor.call('autoTexts.send', {
        trigger: 'CHECKPOINT_FOUND',
        playerId,
        templateVars: {
          group: checkpoint.group,
          text: checkpoint.playerText || '',
          numFound: foundCheckpointsInGroup.length,
          numRemaining:
            checkpointsInGroup.length - foundCheckpointsInGroup.length,
          totalInGroup: checkpointsInGroup.length,
        },
      });
    }
  },
});
