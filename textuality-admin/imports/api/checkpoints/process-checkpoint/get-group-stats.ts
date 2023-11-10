import { Meteor } from 'meteor/meteor';

import Checkpoints from '/imports/api/checkpoints';
import Events from '/imports/api/events';
import { PlayerWithHelpers } from '../../players/players';

interface GroupCheckpointStats {
  group: string;
  numFound: number;
  numRemaining: number;
  total: number;
  complete: boolean;
}

const getCheckpointGroupStats = ({
  player,
  group,
}: {
  player: PlayerWithHelpers;
  group: string;
}): GroupCheckpointStats => {
  const playerCheckpoints = player.checkpoints;

  const checkpointsInGroup = Checkpoints.find({
    event: Events.currentId()!,
    groups: group,
  }).fetch();

  const foundCheckpointsInGroup = checkpointsInGroup.filter((checkpoint) =>
    playerCheckpoints.some((pCheckpoint) => pCheckpoint.id === checkpoint._id),
  );

  return {
    group,
    numFound: foundCheckpointsInGroup.length,
    numRemaining: checkpointsInGroup.length - foundCheckpointsInGroup.length,
    total: checkpointsInGroup.length,
    complete: foundCheckpointsInGroup.length === checkpointsInGroup.length,
  };
};

export default getCheckpointGroupStats;
