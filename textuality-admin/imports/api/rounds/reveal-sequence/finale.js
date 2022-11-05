import Events from 'api/events';
import Rounds from '../rounds';

import Guesses from 'api/guesses';
import Players from 'api/players';
import ClueRewards from 'api/clueRewards';

import waitForSeconds from './_wait-for-seconds';
import getPlayersDict from './_get-players-dict';

const getPerfectPlayers = (roundId) => {
  const solution = Rounds.current().solution;

  const perfectGuesses = Guesses.find(
    {
      round: roundId,
      room: solution.room,
      person: solution.person,
      weapon: solution.weapon,
    },
    { sort: { timeComplete: 1 } }
  ).fetch();
  const playersDict = getPlayersDict();

  const guessPlayers = perfectGuesses.map((guess) => {
    const player = playersDict[guess.player];
    return {
      id: player._id,
      alias: player.alias,
      avatar: player.avatar,
    };
  });

  return {
    currentPlayers: guessPlayers,
    numPlayers: guessPlayers.length,
  };
};

const doFinale = async (roundId) => {
  const { currentPlayers, numPlayers } = getPerfectPlayers(roundId);

  Meteor.call('guesses.gradeGuesses');

  Rounds.update(roundId, {
    $set: {
      'revealState.phase': 'finale-intro',
    },
    $unset: {
      'revealState.currentClue': 1,
      'revealState.currentPlayers': 1,
    },
  });
  await waitForSeconds(5);

  Rounds.update(roundId, {
    $set: {
      'revealState.phase': 'finale-solution',
      'revealState.currentPlayers': currentPlayers,
    },
  });
  await waitForSeconds(25);

  // Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-evidence' } });
  // await waitForSeconds(5);

  // Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-clues' } });
  // await waitForSeconds(5);

  // Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-guesses' } });
  // await waitForSeconds(5);
};

export default doFinale;
