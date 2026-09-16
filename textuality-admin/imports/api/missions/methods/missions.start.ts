import { Meteor } from 'meteor/meteor';
import { sendAutoText } from '../../autoTexts/methods/autoTexts.send';
import shuffle from 'shuffle-array';
import superb from 'superb';
import Events from '../../events';
import MissionPairings from '../../missionPairings';
import Players from '../../players';
import Missions from '../missions';
import { MissionId } from '/imports/schemas/mission';
import { sendCustomAutoText } from '../../autoTexts/methods/autoTexts.sendCustom';
import { EventId } from '/imports/schemas/event';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';
import { missionEnd } from './missions.end';

const getEligiblePlayers = async (eventId: EventId) => {
  return Players.find({
    event: eventId,
    status: 'active',
  }).fetchAsync();
};

const aToZ = /^[a-z]+$/;
const elegibleHashtags = superb.all.filter((word) => aToZ.test(word));

let currentTimeout: number | null = null;

export const missionStart = async (missionId: MissionId) => {
  const eventId = await Events.currentIdOrThrowAsync();
  const mission = await Missions.findOneAsync(missionId);
  if (!mission) return;

  let eligiblePlayers = await getEligiblePlayers(eventId);
  await MissionPairings.removeAsync({ mission: missionId });

  if (eligiblePlayers.length % 2 === 1) {
    eligiblePlayers = eligiblePlayers.filter(
      (player) => player.phoneNumber !== '12024948427',
    );
  }

  shuffle(eligiblePlayers);

  const pairingsToAwait: Promise<string>[] = [];

  for (let i = 0; i < eligiblePlayers.length - 1; i += 2) {
    const playerA = eligiblePlayers[i];
    const playerB = eligiblePlayers[i + 1];

    const hashtag =
      elegibleHashtags[Math.floor(Math.random() * elegibleHashtags.length)];

    const missionPairing = {
      event: eventId,
      mission: missionId,
      playerA: playerA._id,
      playerB: playerB._id,
      aliasA: playerA.alias,
      aliasB: playerB.alias,
      avatarA: playerA.avatar!,
      avatarB: playerB.avatar!,
      hashtag,
    };

    pairingsToAwait.push(MissionPairings.insertAsync(missionPairing));
  }

  await Promise.all(pairingsToAwait);
  const pairings = await MissionPairings.find({
    mission: missionId,
  }).fetchAsync();

  pairings.forEach((pairing) => {
    if (mission.missionPlayerAText && mission.missionPlayerAText.length) {
      sendCustomAutoText({
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
      sendCustomAutoText({
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

  await Missions.updateAsync(mission._id!, {
    $set: {
      active: true,
      timeStart: new Date(),
      timeEnd: new Date(Date.now() + 1000 * 60 * mission.minutes),
    },
  });

  if (currentTimeout) Meteor.clearTimeout(currentTimeout);
  currentTimeout = Meteor.setTimeout(
    () => missionEnd(mission._id),
    1000 * 60 * mission.minutes,
  );
};

export const missionStartMethod = getWrappedServerMethod(
  'missions.start',
  missionStart,
);
