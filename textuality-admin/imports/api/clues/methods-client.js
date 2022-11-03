import { Meteor } from 'meteor/meteor';

import Clues from './clues';
import ClueRewards from 'api/clueRewards';
import Players from 'api/players';
import Events from 'api/events';
import Rounds from 'api/rounds';

const getIneligibleShortnames = () => {
  const round = Rounds.current();
  if (!round || typeof round.solution !== 'object') return [];

  return [round.solution.person, round.solution.room, round.solution.weapon];
};

const getElibigleClues = () => {
  return Clues.find(
    {
      event: Events.currentId(),
      shortName: { $nin: getIneligibleShortnames() },
    },
    { fields: { type: 1, shortName: 1 } }
  ).fetch();
};

const getClueTemplateVars = ({ type, playerId }) => {
  const eligibleClues = getElibigleClues();
  const playerClueRewards = ClueRewards.find(
    { event: Events.currentId(), round: Rounds.currentId(), player: playerId },
    { fields: { clueType: 1 } }
  ).fetch();

  const totalClues = eligibleClues.length;
  const totalCluesOfType =
    type === 'any'
      ? eligibleClues.length
      : eligibleClues.filter((clue) => clue.type === type).length;
  const numCluesFound = playerClueRewards.length;
  const numCluesFoundOfType =
    type === 'any'
      ? playerClueRewards.length
      : playerClueRewards.filter((clueReward) => clueReward.clueType === type)
          .length;

  return {
    totalClues,
    totalCluesOfType,
    numCluesFound,
    numCluesFoundOfType,
    remainingClues: totalClues - numCluesFound,
    remainingCluesOfType: totalCluesOfType - numCluesFoundOfType,
  };
};

Meteor.methods({
  'clues.tryAwardClue': ({ type = 'any', shortName, playerId }) => {
    const round = Rounds.current();
    if (!round) {
      console.warn('Trying to award clue while round inactive, ignoring');
      return;
    }

    const clueQuery = {
      event: Events.currentId(),
    };
    if (type && type !== 'any') {
      clueQuery.type = type;
      clueQuery.shortName = { $nin: getIneligibleShortnames() };
    }
    if (shortName) {
      clueQuery.shortName = shortName;
    }

    const clues = Clues.find(clueQuery).fetch();

    if (clues.length) {
      const player = Players.findOne(playerId);
      const playerClueIds = ClueRewards.find(
        {
          event: Events.currentId(),
          round: Rounds.currentId(),
          player: playerId,
        },
        { fields: { clueId: 1 } }
      ).map((reward) => reward.clueId);

      // The clues that match the query that the player does NOT have.
      const availableClues = clues.filter(
        (clue) => !playerClueIds.includes(clue._id)
      );

      if (availableClues.length === 0) {
        Meteor.call('autoTexts.send', {
          trigger: 'CLUE_REWARD_NONE_LEFT_' + type.toUpperCase(),
          playerId,
        });
        return;
      } else {
        Meteor.call('autoTexts.send', {
          trigger: 'CLUE_REWARD_PRE',
          playerId,
        });
      }

      const clueToGive =
        availableClues[Math.floor(Math.random() * availableClues.length)];

      ClueRewards.insert({
        event: Events.currentId(),
        round: Rounds.currentId(),
        clueId: clueToGive._id,
        clueName: clueToGive.name,
        clueShortName: clueToGive.shortName,
        clueType: clueToGive.type,
        time: new Date(),
        player: playerId,
        alias: player.alias,
        avatar: player.avatar,
        totalCluesFound: playerClueIds.length + 1,
      });

      Clues.update(clueToGive, { $inc: { earned: 1 } });
      Players.update(playerId, { $inc: { numClues: 1 } });

      const triggerParts = ['CLUE_REWARD_POST'];
      const templateVars = getClueTemplateVars({
        type: clueToGive.type,
        playerId,
      });
      if (templateVars.remainingCluesOfType === 0)
        triggerParts.push('COMPLETE');
      triggerParts.push(clueToGive.type.toUpperCase());

      Meteor.call('autoTexts.send', {
        trigger: triggerParts.join('_'),
        playerId,
        mediaUrl: clueToGive.getCardUrl(),
        templateVars: {
          name: clueToGive.name,
          shortName: clueToGive.shortName,
          ...templateVars,
        },
      });
    }
  },
});
