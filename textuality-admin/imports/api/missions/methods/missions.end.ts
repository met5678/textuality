import { sendAutoText } from '../../autoTexts/methods/autoTexts.send';
import { sendCustomAutoText } from '../../autoTexts/methods/autoTexts.sendCustom';
import MissionPairings from '../../missionPairings';
import Missions from '../missions';
import { MissionId } from '/imports/schemas/mission';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const missionEnd = async (missionId: MissionId) => {
  console.log('ending mission');
  const mission = await Missions.findOneAsync(missionId);
  if (!mission || !mission.active) return;
  await Missions.updateAsync(missionId, {
    $set: { active: false, timeEnd: new Date() },
  });

  const incompletePairings = MissionPairings.find({
    mission: missionId,
    complete: false,
  });

  incompletePairings.forEachAsync((pairing) => {
    if (mission.missionFailText) {
      sendCustomAutoText({
        playerText: mission.missionFailText,
        playerId: pairing.playerA,
        source: 'mission',
        templateVars: {},
      });
      sendCustomAutoText({
        playerText: mission.missionFailText,
        playerId: pairing.playerB,
        source: 'mission',
        templateVars: {},
      });
    } else {
      sendAutoText({
        trigger: 'MISSION_FAIL',
        playerId: pairing.playerA,
      });
      sendAutoText({
        trigger: 'MISSION_FAIL',
        playerId: pairing.playerB,
      });
    }
  });
};

export const missionEndMethod = getWrappedServerMethod(
  'missions.end',
  missionEnd,
);
