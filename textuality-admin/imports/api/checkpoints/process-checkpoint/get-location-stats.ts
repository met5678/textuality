import { Meteor } from 'meteor/meteor';

import Checkpoints from '/imports/api/checkpoints';
import Events from '/imports/api/events';
import { PlayerWithHelpers } from '../../players/players';

interface LocationCheckpointStats {
  numFound: number;
  numRemaining: number;
  total: number;
  complete: boolean;
}

const getCheckpointLocationStats = ({
  player,
  location,
}: {
  player: PlayerWithHelpers;
  location: string;
}): LocationCheckpointStats => {
  const playerCheckpoints = player.checkpoints;

  const checkpointsInLocation = Checkpoints.find({
    event: Events.currentId()!,
    location: location,
  }).fetch();

  const foundCheckpointsInLocation = checkpointsInLocation.filter(
    (checkpoint) =>
      playerCheckpoints.some(
        (pCheckpoint) => pCheckpoint.id === checkpoint._id,
      ),
  );

  return {
    numFound: foundCheckpointsInLocation.length,
    numRemaining:
      checkpointsInLocation.length - foundCheckpointsInLocation.length,
    total: checkpointsInLocation.length,
    complete:
      foundCheckpointsInLocation.length === checkpointsInLocation.length,
  };
};

export default getCheckpointLocationStats;
