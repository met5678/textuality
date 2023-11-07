import { Meteor } from 'meteor/meteor';

import Checkpoints from '/imports/api/checkpoints';
import Events from '/imports/api/events';
import { PlayerWithHelpers } from '../../players/players';

const checkGroupsForPlayer = ({
  player,
  group,
}: {
  player: PlayerWithHelpers;
  group: string;
}): boolean => {
  const playerCheckpoints = player.checkpoints;

  const checkpointsInGroup = Checkpoints.find({
    event: Events.currentId()!,
    group: group,
  }).fetch();
  const foundCheckpointsInLocation = checkpointsInGroup.filter((checkpoint) =>
    playerCheckpoints.some((pCheckpoint) => pCheckpoint.id === checkpoint._id),
  );

  if (foundCheckpointsInLocation.length === checkpointsInGroup.length) {
    Meteor.call('achievements.tryUnlock', {
      trigger: 'CHECKPOINT_GROUP',
      triggerDetail: group,
      playerId: player._id,
    });
    return true;
  }
  return false;
};

export default checkGroupsForPlayer;
