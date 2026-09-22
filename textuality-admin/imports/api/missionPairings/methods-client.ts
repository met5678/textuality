import { Meteor } from 'meteor/meteor';

import MissionPairings from './missionPairings';

Meteor.methods({
  'missionPairings.clearForMission': async (missionId: string) => {
    await MissionPairings.removeAsync({ mission: missionId });
  },
});
