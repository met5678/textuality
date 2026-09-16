import { Meteor } from 'meteor/meteor';

import Missions from './missions';
import Events from '/imports/api/events';
import Players from '/imports/api/players';

function getEligiblePlayers() {
  return Players.find({ event: Events.currentId(), status: 'active' }).fetch();
}

import './methods/missions.end';
import './methods/missions.processHashtag';
import './methods/missions.start';

Meteor.methods({
  'missions.preStart': async ({ missionId }) => {
    const mission = await Missions.findOneAsync(missionId);
    if (!mission) return;
    const eligiblePlayers = getEligiblePlayers();

    eligiblePlayers.forEach((player) => {
      if (mission.missionPreText) {
        Meteor.call('autoTexts.sendCustom', {
          playerText: mission.missionPreText,
          playerId: player._id,
          source: 'mission',
          templateVars: {
            mins: mission.minutes,
          },
        });
      } else {
        Meteor.call('autoTexts.send', {
          trigger: 'MISSION_PRESTART',
          playerId: player._id,
          source: 'mission',
          templateVars: {
            mins: mission.minutes,
          },
        });
      }
    });

    Missions.updateAsync(missionId, { $set: { timePreText: new Date() } });
  },
});
