import { Meteor } from 'meteor/meteor';

import MissionPairings from '..';
import Events from '/imports/api/events';

Meteor.publish('missionPairings.latestForMission', function ({ mission, n }) {
  this.autorun(() =>
    MissionPairings.find(
      { event: Events.currentId()!, mission, complete: true },
      {
        sort: { timeComplete: -1 },
        limit: n,
      },
    ),
  );
});
