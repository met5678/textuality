import { Meteor } from 'meteor/meteor';
import { GiveMissionRewardArgs } from '../give-mission-rewards';

export const giveMissionRewardCasino = async ({
  playerA,
  playerB,
  missionId,
}: GiveMissionRewardArgs) => {
  Meteor.call('roulettes.sendHackerClue', {
    missionId,
    playerId: playerA,
  });
  Meteor.call('roulettes.sendHackerClue', {
    missionId,
    playerId: playerB,
  });
};
