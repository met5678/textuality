import { Meteor } from 'meteor/meteor';
import shuffle from 'shuffle-array';
import pokemon from 'pokemon';

import Missions from './missions';
import MissionPairings from 'api/missionPairings';
import Events from 'api/events';
import Players from 'api/players';

function getEligiblePlayers() {
  return Players.find({ event: Events.currentId(), status: 'active' }).fetch();
}

let currentTimeout = null;

Meteor.methods({
  'missions.preStart': ({ missionId }) => {
    const mission = Missions.findOne(missionId);
    const eligiblePlayers = getEligiblePlayers();

    eligiblePlayers.forEach(player => {
      Meteor.call('autoTexts.sendCustom', {
        playerText: mission.missionPreText,
        playerId: player._id,
        source: 'mission'
      });
    });

    Missions.update(missionId, { $set: { timePreText: new Date() } });
  },

  'missions.start': ({ missionId }) => {
    const mission = Missions.findOne(missionId);
    let eligiblePlayers = getEligiblePlayers();

    if (!mission) return;
    MissionPairings.remove({ mission: missionId });

    if (eligiblePlayers.length % 2 === 1) {
      eligiblePlayers = eligiblePlayers.filter(
        player => player.phoneNumber !== '14127194740'
      );
    }

    if (eligiblePlayers.length % 2 === 1) {
      eligiblePlayers = eligiblePlayers.filter(
        player => player.phoneNumber !== '12024948427'
      );
    }

    shuffle(eligiblePlayers);

    for (let i = 0; i < eligiblePlayers.length; i += 2) {
      const playerA = eligiblePlayers[i];
      const playerB = eligiblePlayers[i + 1];
      const missionPairing = {
        event: Events.currentId(),
        mission: missionId,
        playerA: playerA._id,
        playerB: playerB._id,
        aliasA: playerA.alias,
        aliasB: playerB.alias,
        avatarA: playerA.avatar,
        avatarB: playerB.avatar,
        hashtag: pokemon.random().toLowerCase()
      };

      MissionPairings.insert(missionPairing);
    }

    const pairings = MissionPairings.find({ mission: missionId }).fetch();

    pairings.forEach(pairing => {
      Meteor.call('autoTexts.sendCustom', {
        playerText: mission.missionStartTextA,
        playerId: pairing.playerA,
        mediaUrl: pairing.getAvatarUrlB(),
        templateVars: { password: pairing.hashtag },
        source: 'mission'
      });

      Meteor.call('autoTexts.sendCustom', {
        playerText: mission.missionStartTextB,
        playerId: pairing.playerB,
        mediaUrl: pairing.getAvatarUrlA(),
        templateVars: { password: pairing.hashtag },
        source: 'mission'
      });
    });

    Missions.update(mission._id, {
      $set: {
        active: true,
        timeStart: new Date(),
        timeEnd: new Date(Date.now() + 1000 * 60 * mission.minutes)
      }
    });

    if (currentTimeout) Meteor.clearTimeout(currentTimeout);
    currentTimeout = Meteor.setTimeout(
      () => Meteor.call('missions.end', { missionId }),
      1000 * 60 * mission.minutes
    );
  },

  'missions.processHashtag': ({ playerId, hashtag }) => {
    const mission = Missions.active();

    if (!mission) return false;

    const pairing = MissionPairings.findOne({
      mission: mission._id,
      playerB: playerId
    });

    if (!pairing) return false;

    if (hashtag !== pairing.hashtag) return false;

    if (pairing.complete) {
      Meteor.call('autoTexts.send', {
        trigger: 'MISSION_ALREADY_COMPLETED',
        playerId
      });
      return true;
    }

    MissionPairings.update(pairing._id, {
      $set: { complete: true, timeComplete: new Date() }
    });

    Meteor.call('autoTexts.sendCustom', {
      playerText: mission.missionSuccessText,
      playerId: pairing.playerA,
      source: 'mission'
    });
    Meteor.call('autoTexts.sendCustom', {
      playerText: mission.missionSuccessText,
      playerId: pairing.playerB,
      source: 'mission'
    });

    Meteor.call('achievements.tryUnlock', {
      trigger: 'MISSION',
      playerId: pairing.playerA
    });
    Meteor.call('achievements.tryUnlock', {
      trigger: 'MISSION',
      playerId: pairing.playerB
    });

    return true;
  },

  'missions.end': ({ missionId }) => {
    const mission = Missions.findOne(missionId);
    if (!mission) return;
    if (!mission.active) return;

    if (currentTimeout) Meteor.clearTimeout(currentTimeout);

    const incompletePairings = MissionPairings.find({
      mission: missionId,
      complete: false
    });

    incompletePairings.forEach(pairing => {
      Meteor.call('autoTexts.sendCustom', {
        playerText: mission.missionFailText,
        playerId: pairing.playerA,
        source: 'mission'
      });

      Meteor.call('autoTexts.sendCustom', {
        playerText: mission.missionFailText,
        playerId: pairing.playerB,
        source: 'mission'
      });
    });

    Missions.update(missionId, {
      $set: { active: false, timeEnd: new Date() }
    });
  }
});
