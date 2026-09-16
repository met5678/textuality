import Events from '../../events';
import MissionPairings from '../../missionPairings';
import Missions from '../missions';
import { PlayerId } from '/imports/schemas/player';
import { sendAutoText } from '../../autoTexts/methods/autoTexts.send';
import { sendCustomAutoText } from '../../autoTexts/methods/autoTexts.sendCustom';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';
import { tryUnlockAchievement } from '../../achievements/methods-client/achievements.tryUnlock';
import { giveMissionReward } from '../mission-rewards/give-mission-rewards';

type ProcessHashtagArgs = {
  playerId: PlayerId;
  hashtag: string;
};

export const missionProcessHashtag = async ({
  playerId,
  hashtag,
}: ProcessHashtagArgs) => {
  const mission = await Missions.findOneAsync({
    active: true,
    event: Events.currentId(),
  });

  if (!mission) return false;

  const pairing = await MissionPairings.findOneAsync({
    mission: mission._id,
    playerB: playerId,
  });

  if (!pairing) return false;

  if (hashtag !== pairing.hashtag) return false;

  if (pairing.complete) {
    sendAutoText({
      trigger: 'MISSION_ALREADY_COMPLETED',
      playerId,
    });
    return true;
  }

  MissionPairings.updateAsync(pairing._id!, {
    $set: { complete: true, timeComplete: new Date() },
  });

  if (mission.missionSuccessText && mission.missionSuccessText.length) {
    sendCustomAutoText({
      playerText: mission.missionSuccessText,
      playerId: pairing.playerA,
      source: 'mission',
    });
    sendCustomAutoText({
      playerText: mission.missionSuccessText,
      playerId: pairing.playerB,
      source: 'mission',
    });
  } else {
    sendAutoText({
      trigger: 'MISSION_COMPLETE',
      playerId: pairing.playerA,
      source: 'mission',
    });
    sendAutoText({
      trigger: 'MISSION_COMPLETE',
      playerId: pairing.playerB,
      source: 'mission',
    });
  }

  giveMissionReward({
    missionId: mission._id,
    playerA: pairing.playerA,
    playerB: pairing.playerB,
  });

  tryUnlockAchievement({
    trigger: 'MISSION_COMPLETE_N',
    trigger_detail_number: mission.number,
    playerId: pairing.playerA,
  });
  tryUnlockAchievement({
    trigger: 'MISSION_COMPLETE_N',
    trigger_detail_number: mission.number,
    playerId: pairing.playerB,
  });

  return true;
};

export const missionProcessHashTagMethod = getWrappedServerMethod(
  'methods.processHashtag',
  missionProcessHashtag,
);
