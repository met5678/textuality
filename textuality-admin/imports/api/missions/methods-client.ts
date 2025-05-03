import { Meteor } from 'meteor/meteor';
import shuffle from 'shuffle-array';
import pokemon from 'pokemon';
import superb from 'superb';

import Missions from './missions';
import MissionPairings from '/imports/api/missionPairings';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import { sendAutoText } from '../autoTexts/methods/autoTexts.send';
import { raceAwardLogicClue } from '../themes/derby/race/logic-clues/races.awardLogicClue';

function getEligiblePlayers() {
  return Players.find({ event: Events.currentId(), status: 'active' }).fetch();
}

let currentTimeout: number | null = null;

const aToZ = /^[a-z]+$/;
const elegibleHashtags = superb.all.filter((word) => aToZ.test(word));

Meteor.methods({
  'missions.preStart': ({ missionId }) => {
    const mission = Missions.findOne(missionId);
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

    Missions.update(missionId, { $set: { timePreText: new Date() } });
  },

  'missions.start': async ({ missionId }) => {
    const mission = await Missions.findOneAsync(missionId);
    if (!mission) return;

    let eligiblePlayers = getEligiblePlayers();
    await MissionPairings.removeAsync({ mission: missionId });

    if (eligiblePlayers.length % 2 === 1) {
      eligiblePlayers = eligiblePlayers.filter(
        (player) => player.phoneNumber !== '12024948427',
      );
    }

    shuffle(eligiblePlayers);

    for (let i = 0; i < eligiblePlayers.length - 1; i += 2) {
      const playerA = eligiblePlayers[i];
      const playerB = eligiblePlayers[i + 1];

      const hashtag =
        elegibleHashtags[Math.floor(Math.random() * elegibleHashtags.length)];

      const missionPairing = {
        event: Events.currentId()!,
        mission: missionId,
        playerA: playerA._id,
        playerB: playerB._id,
        aliasA: playerA.alias,
        aliasB: playerB.alias,
        avatarA: playerA.avatar!,
        avatarB: playerB.avatar!,
        hashtag,
      };

      MissionPairings.insertAsync(missionPairing);
    }

    const pairings = MissionPairings.find({ mission: missionId }).fetch();

    pairings.forEach((pairing) => {
      if (mission.missionPlayerAText && mission.missionPlayerAText.length) {
        Meteor.call('autoTexts.sendCustom', {
          playerText: mission.missionPlayerAText,
          playerId: pairing.playerA,
          mediaUrl: pairing.getAvatarUrlB(),
          templateVars: { password: pairing.hashtag, mins: mission.minutes },
          source: 'mission',
        });
      } else {
        sendAutoText({
          trigger: 'MISSION_START_PLAYER_A',
          playerId: pairing.playerA,
          mediaUrl: pairing.getAvatarUrlB(),
          templateVars: { password: pairing.hashtag, mins: mission.minutes },
        });
      }

      if (mission.missionPlayerBText && mission.missionPlayerBText.length) {
        Meteor.call('autoTexts.sendCustom', {
          playerText: mission.missionPlayerBText,
          playerId: pairing.playerB,
          mediaUrl: pairing.getAvatarUrlA(),
          templateVars: { password: pairing.hashtag, mins: mission.minutes },
          source: 'mission',
        });
      } else {
        sendAutoText({
          trigger: 'MISSION_START_PLAYER_B',
          playerId: pairing.playerB,
          mediaUrl: pairing.getAvatarUrlA(),
          templateVars: { password: pairing.hashtag, mins: mission.minutes },
        });
      }
    });

    Missions.update(mission._id!, {
      $set: {
        active: true,
        timeStart: new Date(),
        timeEnd: new Date(Date.now() + 1000 * 60 * mission.minutes),
      },
    });

    if (currentTimeout) Meteor.clearTimeout(currentTimeout);
    currentTimeout = Meteor.setTimeout(
      () => Meteor.call('missions.end', { missionId }),
      1000 * 60 * mission.minutes,
    );
  },

  'missions.processHashtag': async ({ playerId, hashtag }) => {
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
      Meteor.call('autoTexts.send', {
        trigger: 'MISSION_ALREADY_COMPLETED',
        playerId,
      });
      return true;
    }

    MissionPairings.updateAsync(pairing._id!, {
      $set: { complete: true, timeComplete: new Date() },
    });

    if (mission.missionSuccessText && mission.missionSuccessText.length) {
      Meteor.call('autoTexts.sendCustom', {
        playerText: mission.missionSuccessText,
        playerId: pairing.playerA,
        source: 'mission',
      });
      Meteor.call('autoTexts.sendCustom', {
        playerText: mission.missionSuccessText,
        playerId: pairing.playerB,
        source: 'mission',
      });
    } else {
      Meteor.call('autoTexts.send', {
        trigger: 'MISSION_COMPLETE',
        playerId: pairing.playerA,
        source: 'mission',
      });
      Meteor.call('autoTexts.send', {
        trigger: 'MISSION_COMPLETE',
        playerId: pairing.playerB,
        source: 'mission',
      });
    }

    raceAwardLogicClue(pairing.playerA);
    raceAwardLogicClue(pairing.playerB);

    Meteor.call('achievements.tryUnlock', {
      trigger: 'MISSION_COMPLETE_N',
      trigger_detail_number: mission.number,
      playerId: pairing.playerA,
    });
    Meteor.call('achievements.tryUnlock', {
      trigger: 'MISSION_COMPLETE_N',
      trigger_detail_number: mission.number,
      playerId: pairing.playerB,
    });

    // This shouldn't be here but it is so we're just gonna do it here
    // Meteor.call('roulettes.sendHackerClue', {
    //   missionId: mission._id,
    //   playerId: pairing.playerA,
    // });
    // Meteor.call('roulettes.sendHackerClue', {
    //   missionId: mission._id,
    //   playerId: pairing.playerB,
    // });

    return true;
  },

  'missions.end': async ({ missionId }) => {
    const mission = await Missions.findOneAsync(missionId);
    if (!mission || !mission.active) return;
    await Missions.updateAsync(missionId, {
      $set: { active: false, timeEnd: new Date() },
    });

    if (currentTimeout) Meteor.clearTimeout(currentTimeout);

    const incompletePairings = MissionPairings.find({
      mission: missionId,
      complete: false,
    });

    incompletePairings.forEach((pairing) => {
      if (mission.missionFailText) {
        Meteor.callAsync('autoTexts.sendCustom', {
          playerText: mission.missionFailText,
          playerId: pairing.playerA,
          source: 'mission',
        });
        Meteor.callAsync('autoTexts.sendCustom', {
          playerText: mission.missionFailText,
          playerId: pairing.playerB,
          source: 'mission',
        });
      } else {
        Meteor.callAsync('autoTexts.send', {
          trigger: 'MISSION_FAIL',
          playerId: pairing.playerA,
          source: 'mission',
        });
        Meteor.callAsync('autoTexts.send', {
          trigger: 'MISSION_FAIL',
          playerId: pairing.playerB,
          source: 'mission',
        });
      }
    });
  },
});
