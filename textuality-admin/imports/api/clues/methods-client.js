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

Meteor.methods({
  'clues.tryAwardClue': ({ type, shortName, playerId }) => {
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
        // No clues available
        // Send autoText?
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

      Meteor.call('autoTexts.sendCustom', {
        playerText: "Here's your clue",
        playerId,
        mediaUrl: clueToGive.getCardUrl(),
        templateVars: {
          type: clueToGive.type,
          name: clueToGive.name,
          shortName: clueToGive.shortName,
        },
      });
    }
  },
});
