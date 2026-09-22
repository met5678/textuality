import { GiveMissionRewardArgs } from '../give-mission-rewards';
import { raceAwardLogicClue } from '/imports/api/themes/derby/race/logic-clues/races.awardLogicClue';

export const giveMissionRewardDerby = async ({
  playerA,
  playerB,
  missionId,
}: GiveMissionRewardArgs) => {
  raceAwardLogicClue(playerA);
  raceAwardLogicClue(playerB);
};
