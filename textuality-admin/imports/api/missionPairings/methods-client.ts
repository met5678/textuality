import { Meteor } from 'meteor/meteor';

import MissionPairings from './missionPairings';
import Events from 'api/events';

Meteor.methods({
  'missionPairings.clearForMission': (missionId: string) => {
    MissionPairings.remove({ mission: missionId });
  },
});
