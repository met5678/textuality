import { Meteor } from 'meteor/meteor';

import Guesses from './guesses';
import Events from 'api/events';
import Clues from 'api/clues';
import Rounds from '../rounds';

const getClueForGuess = ({ type, shortName }) => {
  return Clues.findOne({ type, shortName });
};

const getOptionsListForType = (type) => {
  return Clues.find({ type }, { fields: { shortName: 1 } })
    .fetch()
    .map((clue) => clue.shortName)
    .join(', ');
};

const capitalizeFirstLetter = (str) =>
  `${str[0].toUpperCase()}${str.substring(1)}`;

Meteor.methods({
  'guesses.tryMakeGuess': ({ playerId, type, shortName }) => {
    if (!Rounds.current()) {
      console.warn('Cannot make a guess when a round is not active');
    }

    if (type === 'suspect') type = 'person';
    shortName = shortName.toLowerCase();

    console.log({ playerId, type, shortName });

    if (!shortName.trim()) {
      Meteor.call('autoTexts.send', {
        trigger: `GUESS_${type.toUpperCase()}_EMPTY`,
        playerId,
        templateVars: {
          optionslist: getOptionsListForType(type),
        },
      });
      return;
    }

    const clueForGuess = getClueForGuess({ type, shortName });

    if (!clueForGuess) {
      Meteor.call('autoTexts.send', {
        trigger: `GUESS_${type.toUpperCase()}_INVALID`,
        playerId,
        templateVars: {
          optionslist: getOptionsListForType(type),
        },
      });
      return;
    }

    let playerGuess = Guesses.findOne({
      player: playerId,
      event: Events.currentId(),
      round: Rounds.currentId(),
    });

    if (!playerGuess) {
      console.log('Inserting playerguess', {
        player: playerId,
        event: Events.currentId(),
        round: Rounds.currentId(),
        roundIds: Rounds.allIds(),
      });

      const guessId = Guesses.insert({
        player: playerId,
        event: Events.currentId(),
        round: Rounds.currentId(),
      });
      playerGuess = Guesses.findOne(guessId);
    }

    if (type === 'person' && shortName !== playerGuess.person) {
      Guesses.update(playerGuess._id, {
        $set: {
          timePerson: new Date(),
          person: shortName,
        },
      });
      playerGuess.person = shortName;
    }

    if (type === 'room' && shortName !== playerGuess.room) {
      Guesses.update(playerGuess._id, {
        $set: {
          timeRoom: new Date(),
          room: shortName,
        },
      });
      playerGuess.room = shortName;
    }

    if (type === 'weapon' && shortName !== playerGuess.weapon) {
      Guesses.update(playerGuess._id, {
        $set: {
          timeWeapon: new Date(),
          weapon: shortName,
        },
      });
      playerGuess.weapon = shortName;
    }

    let completeParts = 0;
    playerGuess.person && completeParts++;
    playerGuess.room && completeParts++;
    playerGuess.weapon && completeParts++;

    if (completeParts >= 3) {
      Guesses.update(playerGuess._id, {
        $set: {
          numParts: completeParts,
          timeComplete: new Date(),
        },
      });
    } else {
      Guesses.update(playerGuess._id, {
        $set: {
          numParts: completeParts,
        },
      });
    }

    Meteor.call('autoTexts.send', {
      trigger: `GUESS_${type.toUpperCase()}_SUCCESS`,
      playerId,
      templateVars: {
        room: capitalizeFirstLetter(playerGuess.room ?? '--'),
        weapon: capitalizeFirstLetter(playerGuess.weapon ?? '--'),
        person: capitalizeFirstLetter(playerGuess.person ?? '--'),
      },
    });

    if (completeParts >= 3) {
      Meteor.call('achievements.tryUnlock', {
        trigger: 'GUESS_COMPLETE',
        playerId,
      });
    }
  },
});
