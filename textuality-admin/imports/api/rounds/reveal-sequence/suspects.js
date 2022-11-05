import Events from 'api/events';
import Rounds from '../rounds';

import Guesses from 'api/guesses';
import Clues from 'api/clues';
import Players from 'api/players';

import arraySort from 'array-sort';

import waitForSeconds from './_wait-for-seconds';

const getSuspectsWithGuesses = (roundId) => {
  const personClues = Clues.find({
    event: Events.currentId(),
    type: 'person',
  }).fetch();

  const guesses = Guesses.find({ round: roundId }).fetch();
  const playersDict = Players.find({ event: Events.currentId() })
    .fetch()
    .reduce((acc, player) => {
      acc[player._id] = player;
      return acc;
    }, {});

  const solutionPerson = Rounds.findOne(roundId).solution.person;

  const peopleWithGuesses = arraySort(
    personClues.flatMap((personClue) => {
      const guessesForPerson = arraySort(
        guesses.filter((guess) => guess.person === personClue.shortName),
        'timePerson'
      );

      if (
        guessesForPerson.length === 0 &&
        personClue.shortName !== solutionPerson
      )
        return [];

      const guessPlayers = guessesForPerson.map((guess) => {
        const player = playersDict[guess.player];
        return {
          id: player._id,
          alias: player.alias,
          avatar: player.avatar,
        };
      });

      return [
        {
          currentClue: personClue.shortName,
          currentPlayers: guessPlayers,
          numPlayers: guessPlayers.length,
          isSolutionPerson: personClue.shortName === solutionPerson,
        },
      ];
    }),
    ['isSolutionPerson', 'numPlayers']
  );

  return peopleWithGuesses;
};

const doSuspects = async (roundId) => {
  const suspectsWithGuesses = getSuspectsWithGuesses(roundId);

  Rounds.update(roundId, {
    $set: { 'revealState.phase': 'person-intro' },
    $unset: {
      'revealState.currentClue': 1,
      'revealState.currentPlayers': 1,
    },
  });
  await waitForSeconds(10);

  for (const personWithGuesses of suspectsWithGuesses) {
    Rounds.update(roundId, {
      $set: {
        'revealState.phase': 'person-present',
        'revealState.currentClue': personWithGuesses.currentClue,
        'revealState.currentPlayers': personWithGuesses.currentPlayers,
      },
    });
    await waitForSeconds(5);

    if (!personWithGuesses.isSolutionPerson) {
      Rounds.update(roundId, { $set: { 'revealState.phase': 'person-no' } });
      await waitForSeconds(5);
    } else {
      Rounds.update(roundId, { $set: { 'revealState.phase': 'person-yes' } });
      await waitForSeconds(10);
    }
  }
};

export default doSuspects;
