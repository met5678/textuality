import { Meteor } from 'meteor/meteor';

import MissionPairings from './missionPairings';
import Events from '/imports/api/events';

Meteor.methods({
  'missionPairings.update': async (missionPairing) => {
    await MissionPairings.updateAsync(missionPairing._id, {
      $set: missionPairing,
    });
  },

  'missionPairings.delete': async (missionPairingId) => {
    if (Array.isArray(missionPairingId)) {
      await MissionPairings.removeAsync({ _id: { $in: missionPairingId } });
    } else {
      await MissionPairings.removeAsync(missionPairingId);
    }
  },

  'missionPairings.resetEvent': async () => {
    await MissionPairings.removeAsync({ event: Events.currentId()! });
  },
});
